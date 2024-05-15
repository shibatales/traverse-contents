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

const slotIdToSlotName: Record<number, string> = {
  1001: 'C.ACCESSORIES_SLOT_ID',
  1002: 'C.ARMS_SLOT_ID',
  1003: 'C.BACKGROUND_SLOT_ID',
  1004: 'C.BEARDS_SLOT_ID',
  1005: 'C.CHEST_SLOT_ID',
  1006: 'C.EARS_SLOT_ID',
  1007: 'C.EYES_SLOT_ID',
  1008: 'C.HAIRS_SLOT_ID',
  1009: 'C.LIPS_SLOT_ID'
};

const BASE_ACCESSORIES_SLOT_URI = 'ipfs://QmVY66jqLb5eFsK1VyuNgJs15PkcP6dFDTSDyEBmhUKm22';
const BASE_ARMS_SLOT_URI = 'ipfs://QmYbcbAhEfayzzi6j6EKXJ9VCjL5VSMAkewTqoTrGKaYtX';
const BASE_BACKGROUND_SLOT_URI = 'ipfs://QmYoAutPbWC3oAGGKtinxdZVJDQNv2sbNbFocswYd4QoKY';
const BASE_BEARDS_SLOT_URI = 'ipfs://QmZsY4eJAK8mCfm315CNDhPpksAfBSNk5sfGA3w3ZqjhL8';
const BASE_CHEST_SLOT_URI = 'ipfs://QmW8aayPqC8Vh3sNT1k5VudeGrvUyumBhbLBRAnpgLM6jp';
const BASE_EARS_SLOT_URI = 'ipfs://QmNriCrwDfSpJRpmg5vrpAFeXAv4JuzkCYg43tQyWH2UeP';
const BASE_EYES_SLOT_URI = 'ipfs://QmNjAnzphkgZkM5Xi1tViMJJpp9nFEVwXZxefbmuMskYFd';
const BASE_HAIRS_SLOT_URI = 'ipfs://QmV8hnkGDMQDMPDeQZArAcEQkHNPcYvdDJRreATsdsYvg9';
const BASE_LIPS_SLOT_URI = 'ipfs://QmQij3LeakFbxmty5LyNkjeCQA85t6Aq3aQAyB4iBywZVN';

const categoryToBaseUri: BaseUriMappings = {
  accessories: BASE_ACCESSORIES_SLOT_URI,
  arms: BASE_ARMS_SLOT_URI,
  background: BASE_BACKGROUND_SLOT_URI,
  beards: BASE_BEARDS_SLOT_URI,
  chest: BASE_CHEST_SLOT_URI,
  ears: BASE_EARS_SLOT_URI,
  eyes: BASE_EYES_SLOT_URI,
  hairs: BASE_HAIRS_SLOT_URI,
  lips: BASE_LIPS_SLOT_URI
};

type ItemTuple = [string, number, string, string, string | null];

let fileIndex: number = 4;
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

function getSlotIdName(slotId: number): string {
  return slotIdToSlotName[slotId].replace(/'/g, '');
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
        allHatItems.push([getSlotIdName(slotId), fileIndex, itemPath, rarity, null]);
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
          allArmItems.push([getSlotIdName(slotId), fileIndex, itemPath, rarity, variants]);
          allItems.push([getSlotIdName(slotId), fileIndex, itemPath, rarity, variants]);
          fileIndex++;
        }
      } else if (slotId === 1008) {
        const variantPath = hatFiles[filename] || null;
        allItems.push([getSlotIdName(slotId), fileIndex, itemPath, rarity, variantPath]);
        fileIndex++;
      } else {
        allItems.push([getSlotIdName(slotId), fileIndex, itemPath, rarity, null]);
        fileIndex++;
      }
    }
  });
}

function extractRarity(filePath: string): string {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const rarityAttribute = data.attributes.find((attr: { trait_type: string; value: string; }) => attr.trait_type === 'Rarity');
  return rarityAttribute ? rarityAttribute.value : 'Unknown';
}

processDirectory(jsonDir);

const formatItemUriEntry = (entry: ItemTuple) => entry.map((value, index) => index === 0 ? value : JSON.stringify(value));

const outputContent: string = `export const ALL_ITEM_URIS: ItemUriEntry[] = [\n${ allItems.map(item => `  [${ formatItemUriEntry(item).join(', ') }]`).join(',\n') }\n];`;
const outputHatContent: string = `export const ALL_HAIR_FOR_HAT_URIS: ItemUriEntry[] = [\n${ allHatItems.map(item => `  [${ formatItemUriEntry(item).join(', ') }]`).join(',\n') }\n];`;
const outputArmContent: string = `export const ALL_ARM_URIS: ItemUriEntry[] = [\n${ allArmItems.map(item => `  [${ formatItemUriEntry(item).join(', ') }]`).join(',\n') }\n];`;

fs.writeFileSync(outputFilePath, outputContent + '\n' + outputHatContent + '\n' + outputArmContent);

