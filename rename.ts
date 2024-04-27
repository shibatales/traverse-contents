import fs from 'fs';
import path from 'path';

// Paths to your markdown files and folders
const currentStructurePath: string = 'mapping.md';
const desiredStructurePath: string = 'final-mapping.md';
const assetsFolderPath: string = 'constructor';
const outputFolderPath: string = 'youdle';

// Function to parse a markdown file and return a list of file paths
function parseMarkdown(filePath: string): string[] {
  const content: string = fs.readFileSync(filePath, 'utf8');
  const lines: string[] = content.split('\n');
  const filePaths: string[] = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('-')) {
      // Extract file path, assuming it starts after "- "
      const filePath = trimmedLine.substring(2).trim();
      filePaths.push(filePath);
    }
  });

  return filePaths;
}

// Function to create a renaming map from the current to the desired structure
function createRenamingMap(currentPaths: string[], desiredPaths: string[]): Record<string, string> {
  const renamingMap: Record<string, string> = {};

  // Assuming the number of files and their order in both markdowns are the same
  currentPaths.forEach((currentPath, index) => {
    const desiredPath = desiredPaths[index];
    renamingMap[currentPath] = desiredPath;
  });

  return renamingMap;
}

// Function to recursively copy and rename files from the assets folder to the youdle folder
function copyAndRename(srcFolderPath: string, destFolderPath: string, renamingMap: Record<string, string>): void {
  fs.mkdirSync(destFolderPath, { recursive: true });

  const items: fs.Dirent[] = fs.readdirSync(srcFolderPath, { withFileTypes: true });
  items.forEach(item => {
    const srcPath: string = path.join(srcFolderPath, item.name);
    const destPath: string = path.join(destFolderPath, renamingMap[item.name] || item.name);

    if (item.isDirectory()) {
      copyAndRename(srcPath, destPath, renamingMap);
    } else if (item.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Main function to execute the renaming process
function main(): void {
  const currentPaths: string[] = parseMarkdown(currentStructurePath);
  const desiredPaths: string[] = parseMarkdown(desiredStructurePath);
  const renamingMap: Record<string, string> = createRenamingMap(currentPaths, desiredPaths);

  copyAndRename(assetsFolderPath, outputFolderPath, renamingMap);
  console.log('Renaming and copying completed.');
}

main();