import fs from 'node:fs';

// filename pattern 'dist/*.css'
export function fixCSSSourceMap(filename) {
  try {
    // Fix SourceMappingURL
    const content = fs.readFileSync(filename, { encoding: 'utf8' });
    const lines = content.split('\n');
    lines[1] = lines[1].replace('dist/', '');
    const modifiedContent = lines.join('\n');
    fs.writeFileSync(filename, modifiedContent);
  } catch (err) {
    console.error(err);
  }

  try {
    // Fix SourceMap
    const mapFilename = `${filename}.map`;
    const jsonString = fs.readFileSync(mapFilename, {
      encoding: 'utf8',
    });
    const parsedContent = JSON.parse(jsonString);
    parsedContent.sources[0] = '../' + parsedContent.sources[0];
    const newJSONString = JSON.stringify(parsedContent);
    fs.writeFileSync(mapFilename, newJSONString);
  } catch (err) {
    console.error(err);
  }
}
