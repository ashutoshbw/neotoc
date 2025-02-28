import { LoremIpsum } from 'lorem-ipsum';

interface Options {
  sections?: number;
  goDeep?: string;
  noNumbering?: boolean;
  minWordsPerHeading?: number;
  maxWordsPerHeading?: number;
  minWordsPerSentence?: number;
  maxWordsPerSentence?: number;
  minSentencesPerParagraph?: number;
  maxSentencesPerParagraph?: number;
  minParagraphsPerSection?: number;
  maxParagraphsPerSection?: number;
  sometimesHaveNoParagraphsInParentSections?: boolean;
}

export function makeDummyContent({
  sections = 25,
  goDeep = 'sometimes',
  noNumbering = false,
  minWordsPerHeading = 1,
  maxWordsPerHeading = 6,
  minWordsPerSentence = 4,
  maxWordsPerSentence = 16,
  minSentencesPerParagraph = 4,
  maxSentencesPerParagraph = 8,
  minParagraphsPerSection = 1,
  maxParagraphsPerSection = 8,
  sometimesHaveNoParagraphsInParentSections = true,
}: Options) {
  const goDeepMap: { [x: string]: number } = {
    never: 1,
    rarely: 0.75,
    sometimes: 0.5,
    often: 0.25,
    always: -1,
  };

  const startingHLevel = 2;
  const orders: number[] = [];
  let result: string = '';

  function createH(level: number, content = '', id?: string) {
    return `<h${level}${id ? ` id="${id}"` : ''}>${content}</h${level}>`;
  }

  // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
  function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const loremForPara = new LoremIpsum(
    {
      sentencesPerParagraph: {
        max: maxSentencesPerParagraph,
        min: minSentencesPerParagraph,
      },
      wordsPerSentence: {
        max: maxWordsPerSentence,
        min: minWordsPerSentence,
      },
    },
    'html',
  );

  const loremForHeadingText = new LoremIpsum({
    wordsPerSentence: {
      max: maxWordsPerHeading,
      min: minWordsPerHeading,
    },
  });

  function getNextHLevel(currentLevel: number) {
    if (goDeepMap[goDeep] === undefined) {
      throw Error(
        `'${goDeep}' is not a valid name for how often you want to go deep in sections.`,
      );
    }
    const goDeepDesire = Math.random() > goDeepMap[goDeep];

    if (goDeepDesire && currentLevel != 6) {
      return currentLevel == 6 ? currentLevel : currentLevel + 1;
    } else {
      return randomIntFromInterval(startingHLevel, currentLevel);
    }
  }

  result += loremForPara.generateParagraphs(randomIntFromInterval(0, 3));

  let prevHLevel = startingHLevel;
  let nextHLevel = getNextHLevel(prevHLevel);

  for (let i = 0; i < sections; i++) {
    const curHLevel = i == 0 ? prevHLevel : nextHLevel;

    if (i == 0 || curHLevel > prevHLevel) {
      orders.push(1);
    } else {
      if (curHLevel < prevHLevel) {
        for (let j = 0; j < prevHLevel - curHLevel; j++) {
          orders.pop();
        }
      }

      const lastOrder = orders[orders.length - 1];
      if (typeof lastOrder !== 'undefined') {
        orders[orders.length - 1] = lastOrder + 1;
      }
    }

    nextHLevel = getNextHLevel(curHLevel);

    const numberingString = `${orders.join('.')} `;
    result += createH(
      curHLevel,
      `${noNumbering ? '' : numberingString}${loremForHeadingText.generateSentences(1).slice(0, -1)}`,
      `h-${orders.join('-')}`,
    );

    result += loremForPara.generateParagraphs(
      randomIntFromInterval(
        sometimesHaveNoParagraphsInParentSections &&
          nextHLevel > curHLevel &&
          i != sections - 1
          ? 0
          : minParagraphsPerSection,
        maxParagraphsPerSection,
      ),
    );
    prevHLevel = curHLevel;
  }

  return result;
}
