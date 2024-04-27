import { promises as fs } from 'fs';
import path from 'path';

async function countFiles(dir: string): Promise<number> {
  let count = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const currentPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await countFiles(currentPath);
    } else {
      count++;
    }
  }
  return count;
}

async function main() {
  const rootDir = './youdles'; // Set your root directory path here
  const filesCount = await countFiles(rootDir);
  console.log(`Total files: ${ filesCount }`);
}

main().catch(console.error);