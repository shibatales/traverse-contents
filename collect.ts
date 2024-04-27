import { promises as fs } from 'fs';
import path from 'path';

async function copyFilesToAssets(srcDir: string, destDir: string): Promise<void> {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  await fs.mkdir(destDir, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyFilesToAssets(srcPath, destDir); // Keep destination directory the same to flatten structure
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  const rootDir = './previous/youdle'; // Set your root directory path here
  const assetsDir = './youdles'; // Destination directory for all files
  await copyFilesToAssets(rootDir, assetsDir);
  console.log('All files have been copied to the assets directory.');
}

main().catch(console.error);