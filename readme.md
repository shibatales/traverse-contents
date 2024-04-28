# Directory Traversal and Asset Management Scripts

This repository contains scripts designed to traverse through directories in your file system, listing the contents, and managing assets by copying, updating, and modifying them into structured formats. It outputs the directory structure to a Markdown file named `mapping.md` and manages assets to create a refined `final-mapping.md`.

## Prerequisites

- Node.js installed on your computer. Yarn or pnpm is recommended for package management.

## Setup

1. **Clone the Repository**
   Clone this repository to your local machine using your preferred method.

2. **Install Dependencies**
   Navigate to the cloned repository's root directory in your terminal and run:
   
   `pnpm install` or `yarn install`
   
   This will install all necessary dependencies.

## Usage

### Directory Traversal
1. **Set the Root Directory**
   Open the `traverse.ts` file in your preferred text editor. Locate the line:
   
   `const rootDir = './youdles'; // Set your root directory path here`
   
   Replace `'./youdles'` with the path to the directory you wish to traverse. Ensure the path is enclosed in single quotes. 
   Hint: put your folder in the same directory as the script and use `./folderName`.

3. **Run the Script**
   In your terminal, navigate to the root directory of the cloned repository and run:
   
   `npx ts-node traverse.ts`
   
   This command executes the script using `ts-node`, which allows TypeScript files to be run directly without compiling them to JavaScript first.

5. **View the Output**
   Once the script has finished running, you will find a file named `output.md` in the root directory of the cloned repository. This file contains the structured list of directory contents.

### Asset Management
1. **Copy Assets**
   To copy assets from a source directory to a structured asset directory, use the `collect.ts` script. Set the source directory in the script:
   
   `const rootDir = './previous/youdle'; // Set your source directory path here`
   
   And set the destination directory:
   
   `const assetsDir = './youdles'; // Destination directory for all files`

3. **Run the Asset Copy Script**
   Execute the script by running:
   `npx ts-node collect.ts`
   This will copy all files from the source directory to the destination, maintaining the directory structure.

4. **Update Final Mapping**
   To update the final mapping Markdown file, use the `update.ts` script. Set the input and output file paths in the script:
   
   `const inputFilePath = path.join(__dirname, 'mapping.md');`
   
   `const outputFilePath = path.join(__dirname, 'final-mapping.md');`
   
   Then run:
   
   `npx ts-node update.ts`
   
   This will generate `final-mapping.md` with the structured content as specified.

### Additional Scripts
1. **Count Files**
   Use `count.ts` to tally the number of files within specified directories.

2. **Remove Files**
   Use `remove.ts` to delete files based on specific criteria from directories.

3. **Rename Files**
   Use `rename.ts` to change file names in bulk according to a predefined pattern.

4. **Replace Content**
   Use `replace.ts` to find and replace content within files across directories.

5. **Resize Images**
   Use `resize.ts` to adjust the dimensions of images in bulk.

### Generate CSV Files
1. **Run the CSV Generation Script**
   The `createAllCsvs.ts` script is used to process directories and generate CSV files for each category of assets. This is useful for cataloging and managing large sets of assets systematically.
   To run this script, navigate to the root directory of the cloned repository and execute:
   
   `npx ts-node createAllCsvs.ts`
   
   Ensure that the script is configured with the correct paths and categories before running.

### Merge CSV Files
1. **Run the Merge Script**
   The `merge.ts` script is used to combine multiple CSV files into a single CSV file. This is useful for consolidating data from various sources.
   To run this script, navigate to the root directory of the cloned repository and execute:
   
   `npx ts-node merge.ts`
   
   Ensure that the script is configured with the correct paths to the CSV files before running.

## Notes
- The scripts are configured to ignore directories with "ignore" or "Custom" in their names and `.DS_Store` files. Adjust the filtering logic in `traverse.ts` if you need different behavior.

## Troubleshooting
If you encounter any issues while running the scripts, ensure that:
- Node.js is properly installed and updated to the latest version.
- You have set the correct paths for the `rootDir` and `assetsDir` variables in the scripts.
- You have write permissions in the directory where the output files are being created.

For further assistance, consider seeking help from online programming communities or the documentation for the tools and languages used in these scripts.
