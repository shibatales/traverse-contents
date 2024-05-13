import fs from 'fs';
import path from 'path';
import { stringify } from 'csv-stringify';

interface CsvDataType {
  filename: string;
  name: string;
  mediaUri: string;
  thumbnailUri: string;
  attributes: string;
  preferThumb: string;
  externalUri: string;
}

interface AttributesType { rarity?: string, gender?: string, color?: string, hat?: 'bool:1' | 'bool:0';[key: string]: string | undefined; }

const baseUri = "ipfs://QmVkVwq9wJK55WCk58gkjGK8hpgTi8XSJ6BmX34Q3zb65N/";
const categories = ['arms', 'lips', 'hairs', 'eyes', 'ears', 'accessories', 'beards', 'chest', 'skin', 'background'];
const youdlesDir = path.join(__dirname, 'youdles');
const outputDir = path.join(__dirname, 'metadata');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

categories.forEach(category => {
  const categoryPath = path.join(youdlesDir, category);
  const csvData: CsvDataType[] = [];
  const headers = ['filename', 'name', 'mediaUri', 'thumbnailUri', 'attributes', 'preferThumb', 'externalUri'];

  console.log(`Processing category: ${ category }`);

  function processDirectory(directory: string, relativePath: string = '') {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(file => {
      const filePath = path.join(directory, file.name);
      const fileRelativePath = path.join(relativePath, file.name);
      if (file.isDirectory()) {
        processDirectory(filePath, fileRelativePath);
      } else if (file.isFile() && path.extname(file.name) === '.png' && !file.name.includes('_350x350')) {
        const filename = path.basename(file.name, '.png');
        let name = filename.replace(/^\d+_(?=\w)/, ''); // Remove numeric prefix and optional underscore and space

        // Special handling for 'hairs' category with 'hat_' prefix
        if (category === 'hairs' && name.startsWith('hat_')) {
          name = name.replace('hat_', '') + ' (Hat)'; // Remove 'hat_' prefix and append '(Hat)'
        }

        name = name.replace(/^\d+_(?=\w)/, '');

        name = name.replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/\s+/g, ' ').trim(); // Capitalize and clean up spaces

        const mediaUri = `${ baseUri }${ category }/${ fileRelativePath }`;
        const thumbnailUri = `${ baseUri }${ category }/${ fileRelativePath.replace('.png', '_350x350.png') }`;
        const attributes = extractAttributes(category, file.name, directory, name);
        const attributesString = Object.entries(attributes)
          .map(([key, value]) => `${ key }:${ value }`)
          .join(',');

        csvData.push({
          filename,
          name,
          mediaUri,
          thumbnailUri,
          attributes: attributesString,
          preferThumb: 'true',
          externalUri: 'https://youdles.xyz'
        });

        console.log(`Added file to CSV data: ${ filename }`);
      }
    });
  }

  processDirectory(categoryPath);

  const csvStringifier = stringify({ columns: headers, header: true });
  const writeStream = fs.createWriteStream(path.join(outputDir, `${ category }.csv`));

  csvStringifier.on('finish', () => {
    console.log(`CSV file has been written for category: ${ category }`);
  });

  csvStringifier.pipe(writeStream);

  csvData.forEach(data => {
    csvStringifier.write(data);
  });

  csvStringifier.end();
});

function extractAttributes(category: string, filename: string, directory: string, name: string) {
  const attributes: AttributesType = {};
  const parts = filename.split('_');
  const genderRegex = /male|female/;
  const colorRegex = /(?:\d+_)?(dark|light|tan)|(?:male|female_)(black|blond|brown|white)/;
  const rarityRegex = /\/(common|rare|rainbow)\//;
  const rarityMatch = directory.match(rarityRegex);

  if (rarityMatch) {
    const rarityValue = rarityMatch[1].charAt(0).toUpperCase() + rarityMatch[1].slice(1);
    attributes.Rarity = `string:${ rarityValue }`;
  }

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  attributes[categoryName] = `string:${ name }`;

  parts.forEach(part => {
    const genderMatch = part.match(genderRegex);
    if (genderMatch) {
      const genderValue = genderMatch[0].charAt(0).toUpperCase() + genderMatch[0].slice(1);
      attributes.Gender = `string:${ genderValue }`;
    }

    const colorMatch = part.match(colorRegex);
    if (colorMatch) {
      const colorValue = (colorMatch[1] || colorMatch[2]).charAt(0).toUpperCase() + (colorMatch[1] || colorMatch[2]).slice(1);
      if (category === 'arms' || category === 'hairs') {
        attributes.Color = `string:${ colorValue }`;
      }
    }

    if (category === 'hairs') {
      if (filename.startsWith('hat_')) {
        attributes.Hat = 'bool:1';
      } else {
        attributes.Hat = 'bool:0';
      }
    }
  });

  return attributes;
}