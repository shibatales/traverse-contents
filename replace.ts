import fs from 'fs';
import path from 'path';

// Define the pattern to match filenames accurately
// This pattern is designed to capture the sequence of a number followed by codes and the rest of the filename
const pattern = /^(\s*)- (hat--)?(\d+|[a-zA-Z]+)([FMDLTBLRW]+)-([\w\s.-]+)\.png$/i;

// Mapping of codes to their replacements, ensuring accurate and intended transformations
const codeMappings = {
  'F': 'female',
  'M': 'male',
  'D': 'dark',
  'L': 'light',
  'T': 'tan',
  'B': 'blond',
  'BL': 'black',
  'BR': 'brown',
  'W': 'white',
  'FB': 'female_blond',
  'FBL': 'female_black',
  'FBR': 'female_brown',
  'FW': 'female_white',
  'MB': 'male_blond',
  'MBL': 'male_black',
  'MBR': 'male_brown',
  'MW': 'male_white'
};

function replaceWithDefinitions(line: string): string {
  let processedLine = line.replace(pattern, (match, indent, prefix, numberOrLetter, codes, name) => {
    // Initialize replacementParts with the prefix and numberOrLetter if present
    let replacementParts = prefix ? [prefix.trim() + numberOrLetter] : [numberOrLetter];
    // Sort the codeMappings by key length in descending order to match longer codes first
    Object.entries(codeMappings).sort((a, b) => b[0].length - a[0].length).forEach(([code, replacement]) => {
      // Replace codes with their full text representation if they exist in the string
      if (codes.includes(code)) {
        replacementParts.push(replacement);
        codes = codes.replace(new RegExp(code, 'g'), ''); // Remove the matched code
      }
    });
    // Format the name part correctly, replacing spaces and periods with underscores and converting to lowercase
    let formattedName = name.trim().replace(/[\s.-]+/g, '_').toLowerCase();
    // Construct the new line with the correctly formatted parts
    return `${ indent }- ${ replacementParts.join('_') }_${ formattedName }.png`;
  });

  // Apply general formatting if the line wasn't modified by the pattern
  if (processedLine === line && line.trim().startsWith('-')) {
    processedLine = line.toLowerCase().replace(/^(\s*- )(.+)$/, (match, markdownSyntax, content) => {
      return `${ markdownSyntax }${ content.replace(/[\s-]+/g, '_') }`;
    });
  }

  return processedLine;
}

function processFile(filePath: string, outputPath: string): void {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    const lines = data.split('\n');
    const processedLines = lines.map(replaceWithDefinitions).join('\n');

    fs.writeFile(outputPath, processedLines, err => {
      if (err) {
        console.error('Error writing the output file:', err);
      } else {
        console.log(`Processed file has been saved to ${ outputPath }`);
      }
    });
  });
}

const mappingFilePath = path.join(__dirname, 'mapping.md');
const outputFilePath = path.join(__dirname, 'final-mapping.md');

processFile(mappingFilePath, outputFilePath);