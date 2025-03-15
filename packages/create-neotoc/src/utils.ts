import fs from 'node:fs';
import path from 'node:path';
import { log } from '@clack/prompts';
import pc from 'picocolors';

export function checkFileExists(filePath: string) {
  try {
    fs.statSync(filePath);
    return true;
  } catch {
    return false;
  }
}

export function generateNewDirName(prefix: string) {
  if (!checkFileExists(prefix)) return prefix;
  let num = 1;
  while (checkFileExists(`${prefix}-${num}`)) {
    num++;
  }
  return `${prefix}-${num}`;
}

export function drawBorderedBoxInPrompts(title: string, messages: string[]) {
  const paddingRight = 0;
  const maxWidth = Math.max(...[title, ...messages].map((s) => s.length));
  const printBlankLine = () =>
    console.log(pc.gray(`│${' '.repeat(2 + maxWidth + paddingRight + 4)}│`));

  const titleBorder = pc.gray(
    `${'─'.repeat(1 + maxWidth - title.length + paddingRight)}╮`,
  );
  log.step(`${title}  ${titleBorder}`);
  printBlankLine();
  messages.forEach((msg) => {
    console.log(
      pc.gray(
        `│  ${pc.greenBright(msg)}${' '.repeat(maxWidth - msg.length + paddingRight + 1)}   │`,
      ),
    );
  });
  printBlankLine();
  console.log(pc.gray(`├${'─'.repeat(maxWidth + paddingRight + 3)}───╯`));
}

export function detectPackageManager() {
  const validPkgManagers = ['npm', 'pnpm', 'yarn', 'bun'];
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent && userAgent.indexOf('/') !== -1) {
    const pkgManager = userAgent.slice(0, userAgent.indexOf('/'));
    if (validPkgManagers.includes(pkgManager)) {
      return pkgManager;
    } else {
      throw new Error(`Unknown package manager: ${pkgManager}`);
    }
  }
  throw new Error(`Package manager not found`);
}

export function copy(src: string, dest: string, ignore: string[] = []) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest, ignore);
  } else {
    if (!ignore.includes(path.basename(src))) {
      fs.copyFileSync(src, dest);
    }
  }
}

export function copyDir(
  srcDir: string,
  destDir: string,
  ignore: string[] = [],
) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    if (!ignore.includes(path.basename(srcFile))) {
      copy(srcFile, destFile, ignore);
    }
  }
}
