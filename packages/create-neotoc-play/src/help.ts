import chalk from 'chalk';
import { log, detectPackageManager, getPkgRunner } from './utils';
import { versionData } from './version';

const pkgManager = detectPackageManager();
const pkgRunner = getPkgRunner(pkgManager);

export function printHelp() {
  log(`\
${chalk.bold('neotoc-playground v' + versionData.neotocPlayground)}
Uses ${'neotoc v' + versionData.neotoc}

${chalk.bold('DESCRIPTION:')}
A tool to generate random dummy content in a basic HTML, CSS, and JS setup for
experimenting with Neotoc locally.

${chalk.bold('USAGE:')}
    ${pkgRunner} neotoc-playground
    ${pkgRunner} neotoc-playground [OPTIONS]

If no options are provided, an interactive prompt will guide you through 
setting up the playground.

Otherwise, you can use options to customize it:

${chalk.bold('REQUIRED OPTIONS:')}
    -n, --name '<NAME>'
        Specifies the directory where the neotoc playground will be created.
        Example usage:

            ${pkgRunner} neotoc-playground --name=firstplay
            ${pkgRunner} neotoc-playground --name firstplay
            ${pkgRunner} neotoc-playground -n=firstplay
            ${pkgRunner} neotoc-playground -n firstplay

        The examples show that '=' is optional. Short options can also be used.
        This applies to all options that accept values.

${chalk.bold('OPTIONAL OPTIONS:')}
    -b, --base <STYLE>
        Specifies the base style for neotoc.
        Available: 
           - "plain"
           - "modern" (default)

    -c, --colors <SCHEME>
        Sets the color scheme for neotoc.
        Available: 
           - "monochrome"
           - "zinc" (default)
           - "slate"

    -s, --sections <NUMBER>
        Specifies the number of sections to generate, each with a heading.
        <NUMBER> must be a non-negative integer.
        Default: 25

        Note: Sections are a conceptual representation using different 
        heading levels rather than actual "<section>" HTML elements.

    -d, --go-deep <FREQUENCY>
        Controls the nesting depth of sections (conceptually, without 
        <section> elements).
        Available: 
            - "never"
            - "rarely"
            - "sometimes" (default)
            - "often"
            - "always"
        Example usage:

            ${pkgRunner} neotoc-playground --name=deeplay --go-deep=always
            ${pkgRunner} neotoc-playground -n deeplay -d always

    -r, --no-numbering
        Disables hierarchical numbering of headings.
        Example usage:

            ${pkgRunner} neotoc-playground --name=nonumbers -r

    -v, --version
        Displays the version of neotoc-playground and neotoc.

    -h, --help
        Shows this help page.

${chalk.bold('How to randomly remake the dummy content?')}
    No need to recreate the playground from scratch. Once the playground is
    created, you can easily randomize the dummy content using:

        ${pkgManager} run remake

    This modifies only the content within the element having ${chalk.bgGray('id="dummy-content"')}
    keeping everything else unchanged.

    You can modify the dummy content generation configuration in
    'neotoc-playground.json'. Additional parameters that are not available as CLI
    options/interactive prompt can be tweaked there.

${chalk.bold('AUTHOR:')}
    Ashutosh Biswas
`);
}
