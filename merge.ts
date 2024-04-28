import * as fs from 'fs';
import * as path from 'path';
import { parse as csvParse } from 'csv-parse';
import { stringify as csvStringify } from 'csv-stringify';

const inputDir: string = path.join(__dirname, 'metadata');
const outputFile: string = path.join(__dirname, 'all.csv');

fs.readdir(inputDir, (err: NodeJS.ErrnoException | null, files: string[]) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  const csvFiles: string[] = files.filter(file => file.endsWith('.csv') && !file.includes('skin'));
  let allRows: any[] = [];

  let filesProcessed: number = 0;

  csvFiles.forEach((file: string) => {
    const filePath: string = path.join(inputDir, file);
    const parser = fs.createReadStream(filePath).pipe(csvParse({ columns: true }));

    parser.on('data', (row: any) => {
      allRows.push(row);
    });

    parser.on('end', () => {
      filesProcessed++;
      if (filesProcessed === csvFiles.length) {
        csvStringify(allRows, { header: true }, (err: Error | undefined | null, output: string) => {
          if (err) {
            console.error('Error writing CSV:', err);
            return;
          }

          fs.writeFile(outputFile, output, (err: NodeJS.ErrnoException | null) => {
            if (err) {
              console.error('Error saving combined CSV:', err);
            } else {
              console.log('Combined CSV created successfully:', outputFile);
            }
          });
        });
      }
    });

    parser.on('error', (err: Error) => {
      console.error('Error parsing CSV:', err);
    });
  });
});