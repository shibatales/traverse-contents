import { promises as fs } from 'fs';
import path from 'path';

async function updateOutputMd(inputFilePath: string, outputFilePath: string) {
  try {
    let content = await fs.readFile(inputFilePath, 'utf8');

    let updatedContent = content
      .split('\n')
      .map(line => {
        // Only process lines that start with a markdown list item
        if (line.trim().startsWith('-')) {
          // Extract leading spaces to maintain indentation
          const leadingSpaces = line.match(/^\s*/)?.[0] ?? '';
          const [, markdownListItem, number, text] = line.match(/^(\s*-\s*)(\d+\.)?(.*)$/) ?? ['', '', '', ''];
          if (text) {
            // Replace dashes and spaces with underscores in the text, and make lowercase
            const updatedText = text.replace(/[- ]/g, '_').toLowerCase();
            // Reconstruct the line with the original structure, including leading spaces and markdown list item
            return `${ leadingSpaces }${ markdownListItem }${ number ? number : '' }${ updatedText }`;
          }
        }
        // Return the line unchanged if it does not start with a markdown list item
        return line;
      })
      .join('\n');

    await fs.writeFile(outputFilePath, updatedContent);
    console.log(`${ outputFilePath } has been created with the updated content.`);
  } catch (error) {
    console.error('Error processing the file:', error);
  }
}

const inputFilePath = path.join(__dirname, 'output.md');
const outputFilePath = path.join(__dirname, 'finalOutput.md');
updateOutputMd(inputFilePath, outputFilePath);