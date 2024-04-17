"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function listDirectoryContents(dirPath_1) {
    return __awaiter(this, arguments, void 0, function* (dirPath, prefix = '') {
        let output = '';
        const entries = yield fs_1.promises.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            // Skip directories with "IGNORE/ignore" or "Custom" in their names and .DS_Store files
            if (entry.name.toLowerCase().includes("ignore") || entry.name.includes("Custom") || entry.name === '.DS_Store') {
                continue;
            }
            const entryPath = path_1.default.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                output += `${prefix}- ${entry.name}\n`;
                output += yield listDirectoryContents(entryPath, prefix + '  ');
            }
            else {
                output += `${prefix}- ${entry.name}\n`;
            }
        }
        return output;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const rootDir = './assets'; // Set your root directory path here
        const output = yield listDirectoryContents(rootDir);
        // Write the output to a Markdown file
        yield fs_1.promises.writeFile('output.md', output);
        console.log('Directory contents written to output.md');
    });
}
main().catch(console.error);
``;
