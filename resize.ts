import * as fs from 'fs';
import * as path from 'path';
import Jimp from 'jimp';

const directoryPath: string = path.join(__dirname, 'youdles');

// Function to resize images
function resizeImage(filePath: string): void {
  const fileName: string = path.basename(filePath, '.png');
  const outputFileName: string = `${ fileName }_350x350.png`;
  const outputPath: string = path.join(path.dirname(filePath), outputFileName);

  Jimp.read(filePath)
    .then(image => {
      return image
        .resize(350, 350) // resize
        .writeAsync(outputPath); // save
    })
    .then(() => {
      console.log(`Resized and saved: ${ outputPath }`);
    })
    .catch(err => {
      console.error(`Error processing ${ filePath }:`, err);
    });
}

// Function to recursively read and process files
function processDirectory(dirPath: string): void {
  fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error(`Could not list the directory ${ dirPath }.`, err);
      return;
    }

    entries.forEach(entry => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (path.extname(entry.name).toLowerCase() === '.png') {
        console.log(`Processing image: ${ fullPath }`);
        resizeImage(fullPath);
      }
    });
  });
}

// Start processing
processDirectory(directoryPath);