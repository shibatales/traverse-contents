import { promises as fs } from 'fs';
import path from 'path';

async function removeDS_StoreFiles(dir: string): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const currentPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await removeDS_StoreFiles(currentPath);
    } else if (entry.name === '.DS_Store') {
      await fs.unlink(currentPath);
    }
  }
}

async function main() {
  const rootDir = './youdle'; // Set your root directory path here
  await removeDS_StoreFiles(rootDir);
  console.log('.DS_Store files have been removed.');
}

main().catch(console.error);