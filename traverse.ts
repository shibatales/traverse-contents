import { promises as fs } from 'fs';
import path from 'path';

async function listDirectoryContents(dirPath: string, prefix: string = ''): Promise<string> {
  let output = '';
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    // Add filters here
    // Skip directories with "IGNORE/ignore" or "Custom" in their names and .DS_Store files
    if (entry.name.toLowerCase().includes("ignore") || entry.name.includes("Custom") || entry.name === '.DS_Store') {
      continue;
    }

    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      output += `${ prefix }- ${ entry.name }\n`;
      output += await listDirectoryContents(entryPath, prefix + '  ');
    } else {
      output += `${ prefix }- ${ entry.name }\n`;
    }
  }
  return output;
}

async function main() {
  const rootDir = './youdles'; // Set your root directory path here
  const output = await listDirectoryContents(rootDir);
  // Write the output to a Markdown file
  await fs.writeFile('mapping.md', output);
  console.log('Directory contents written to mapping.md');
}

main().catch(console.error);