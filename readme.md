# Directory Traversal Script

This script is designed to traverse through directories in your file system, listing the contents while filtering out specific directories and files. It outputs the directory structure to a Markdown file named `output.md`.

## Prerequisites

- Node.js installed on your computer.

## Setup

1. **Clone the Repository**

   Clone this repository to your local machine using your preferred method.

2. **Install Dependencies**

   Navigate to the cloned repository's root directory in your terminal and run:

  `npm install`

   This will install all necessary dependencies.

## Usage

1. **Set the Root Directory**

   Open the `traverse.ts` file in your preferred text editor. Locate the line:

  `const rootDir = './assets'; // Set your root directory path here`

   Replace `'./assets'` with the path to the directory you wish to traverse. Ensure the path is enclosed in single quotes. 
   Hint: put your folder in the same directory as the script and use `./folderName`.

2. **Run the Script**

   In your terminal, navigate to the root directory of the cloned repository and run:

  `npx ts-node traverse.ts`

   This command executes the script using `ts-node`, which allows TypeScript files to be run directly without compiling them to JavaScript first.

3. **View the Output**

   Once the script has finished running, you will find a file named `output.md` in the root directory of the cloned repository. This file contains the structured list of directory contents.

## Notes

- The script is configured to ignore directories with "ignore" or "Custom" in their names and `.DS_Store` files. Adjust the filtering logic in `traverse.ts` if you need different behavior.

## Troubleshooting

If you encounter any issues while running the script, ensure that:

- Node.js is properly installed and updated to the latest version.
- You have set the correct path for the `rootDir` variable in `traverse.ts`.
- You have write permissions in the directory where the `output.md` file is being created.

For further assistance, consider seeking help from online programming communities or the documentation for the tools and languages used in this script.