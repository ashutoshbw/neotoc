import pc from 'picocolors';

export function printHelp() {
  const text = `\
${pc.bold('USAGE')}
  create-neotoc [OPTIONS] [DIRECTORY]

Create a neotoc playground to experiment with neotoc.
With no arguments, start the CLI in interactive mode.

${pc.bold('OPTIONS')}
  --base, -b <style-name>       Use a base style
  --colors, -c <color-scheme>   Use a color scheme
  --help, -h                    Show help
  --version, -v                 Show version

${pc.bold('AVAILABLE BASE STYLES')}
- modern: Rounded corners with some subtle decorative styles
- plain: No rounded corners and subtle decorative styles

${pc.bold('AVAILABLE COLOR SCHEMES')}
- zinc: Based on TailwindCSS's zinc color palette
- slate: Based on TailwindCSS's slate color palette
- monochrome: Black and white
`;
  console.log(text);
}
