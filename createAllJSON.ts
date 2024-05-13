import fs from 'fs';
import path from 'path';

const jsonDir: string = path.join(__dirname, 'json');
const outputFilePath: string = path.join(__dirname, 'all-items.ts');

interface CategoryMappings {
  [key: string]: number;
}

interface BaseUriMappings {
  [key: string]: string;
}

const categoryToSlotId: CategoryMappings = {
  accessories: 1001,
  arms: 1002,
  background: 1003,
  beards: 1004,
  chest: 1005,
  ears: 1006,
  eyes: 1007,
  hairs: 1008,
  lips: 1009
};

const categoryToBaseUri: BaseUriMappings = {
  accessories: 'ipfs://QmfEjHW3bxf8Y4yaefZb1GbUTAc7ddBXo7zET5CFaunPws',
  arms: 'ipfs://QmesXQbQgrrLi8iPQBwZzK8RsQMP4KmtFQGPMF69sNGAYs',
  background: 'ipfs://QmfYeuXsMhuguQCNphyJnnKDeX1z29j5M1gqkg6PofnBEM',
  beards: 'ipfs://QmYXEgJUATQ1nHok6dNAD3Vy7LVKDByoEV5jiD31H55Gxm',
  chest: 'ipfs://QmeX4n4LwQ3THatjGn7jcqTDdrn3x4J6XaGHtZAA1DG5dK',
  ears: 'ipfs://QmWWxnN2DuUK32vVXoXKmkNpDY9ErEA45FvbjnWfJ8KdnS',
  eyes: 'ipfs://Qmdh94NKeBV5gLJ3sG1LEBNVgBifSs5fSf6y7ywVwrUK6i',
  hairs: 'ipfs://QmTTEEZ9UiQqzg5EAMz9znsmCkpqwfvWnZQiGGqxNj7mvk',
  lips: 'ipfs://QmVfn4vF3D92mYn454xhiyiMYRz3MDrnNGAvUyX16n1wyj'
};

type ItemTuple = [number, number, string, string, string | null];

let fileIndex: number = 4;
let hatFileIndex: number = 1;
let armFileIndex: number = 1;
let allItems: ItemTuple[] = [];
let allHatItems: ItemTuple[] = [];
let allArmItems: ItemTuple[] = [];

function processDirectory(directory: string): void {
  fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => {
    if (entry.isDirectory()) {
      const category: string = entry.name;
      if (categoryToSlotId[category]) {
        const categoryPath: string = path.join(directory, category);
        processCategory(categoryPath, category);
      }
    }
  });
}

function processCategory(categoryPath: string, category: string): void {
  fs.readdirSync(categoryPath, { withFileTypes: true }).forEach(entry => {
    if (entry.isDirectory()) {
      const assetsPath: string = path.join(categoryPath, entry.name);
      processAssets(assetsPath, category);
    }
  });
}

function processAssets(assetsPath: string, category: string): void {
  const files = fs.readdirSync(assetsPath, { withFileTypes: true });

  let hatFiles: Record<string, string> = {};
  let armFiles: Record<string, string[]> = {};

  // First pass: Process and store all hat and arm files
  files.forEach(entry => {
    if (entry.isFile() && path.extname(entry.name) === '.json') {
      const slotId: number = categoryToSlotId[category];
      const baseUri: string = categoryToBaseUri[category];
      const filename: string = entry.name;
      const itemPath: string = `${ baseUri }/assets/${ filename }`;
      const rarity: string = extractRarity(path.join(assetsPath, filename));

      if (entry.name.startsWith('hat_')) {
        hatFiles[filename.substring(4)] = itemPath;
        allHatItems.push([slotId, fileIndex, itemPath, rarity, null]);
        fileIndex++;
      } else if (slotId === 1002) {
        const baseName = filename.replace(/_(tan|light|dark)(_.+)?\.json$/, '');
        if (!armFiles[baseName]) {
          armFiles[baseName] = [];
        }
        armFiles[baseName].push(filename);
      }
    }
  });

  // Second pass: Process all other files and compute variants
  files.forEach(entry => {
    if (entry.isFile() && path.extname(entry.name) === '.json' && !entry.name.startsWith('hat_')) {
      const slotId: number = categoryToSlotId[category];
      const baseUri: string = categoryToBaseUri[category];
      const filename: string = entry.name;
      const itemPath: string = `${ baseUri }/assets/${ filename }`;
      const rarity: string = extractRarity(path.join(assetsPath, filename));

      if (slotId === 1002) {
        const baseName = filename.replace(/_(tan|light|dark)(_.+)?\.json$/, '');
        const colorMatch = filename.match(/_(tan|light|dark)/);
        if (colorMatch) {
          const color = colorMatch[1];
          const otherColors = ['tan', 'light', 'dark'].filter(c => c !== color);
          const suffixMatch = filename.match(/(_.+)?\.json$/);
          const suffix = suffixMatch ? suffixMatch[0].replace(/_(tan|light|dark)/, '') : '.json';
          const variants = otherColors.map(c => `${ baseUri }/assets/${ baseName }_${ c }${ suffix }`).join(',');
          allArmItems.push([slotId, fileIndex, itemPath, rarity, variants]);
          allItems.push([slotId, fileIndex, itemPath, rarity, variants]);
          fileIndex++;
        }
      } else if (slotId === 1008) {
        const variantPath = hatFiles[filename] || null;
        allItems.push([slotId, fileIndex, itemPath, rarity, variantPath]);
        fileIndex++;
      } else {
        allItems.push([slotId, fileIndex, itemPath, rarity, null]);
        fileIndex++;
      }
    }
  });
}

function extractRarity(filePath: string): string {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const rarityAttribute = data.attributes.find((attr: { trait_type: string; value: string; }) => attr.trait_type === 'Rarity');
  return rarityAttribute ? (rarityAttribute.value === 'Rainbow' ? 'Legendary' : rarityAttribute.value === 'Rare' ? 'Epic' : rarityAttribute.value) : 'Unknown';
}

processDirectory(jsonDir);

const outputContent: string = `export const ALL_ITEM_URIS: ItemUriEntry[] = ${ JSON.stringify(allItems, null, 2) };`;
const outputHatContent: string = `export const ALL_HAT_URIS: ItemUriEntry[] = ${ JSON.stringify(allHatItems, null, 2) };`;
const outputArmContent: string = `export const ALL_ARM_URIS: ItemUriEntry[] = ${ JSON.stringify(allArmItems, null, 2) };`;

fs.writeFileSync(outputFilePath, outputContent + '\n' + outputHatContent + '\n' + outputArmContent);

