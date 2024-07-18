interface Options {
  contentElement: HTMLElement;
  headings: HTMLHeadingElement[];
  root?: HTMLElement;
  rootMarginTop?: number;
  rootMarginBottom?: number;
}

const defaultOptions: Partial<Options> = {
  root: document.documentElement,
  rootMarginTop: 0,
  rootMarginBottom: 0,
};

export default function tocMirror(options: Options) {
  const { contentElement, headings, root }: Options = {
    ...defaultOptions,
    ...options,
  };

  return {
    setupMirror() {},
    reflect() {},
    refresh() {},
    remove() {},
  };
}
