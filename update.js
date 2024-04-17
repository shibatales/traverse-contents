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
function updateOutputMd(inputFilePath, outputFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let content = yield fs_1.promises.readFile(inputFilePath, 'utf8');
            let updatedContent = content
                .split('\n')
                .map(line => {
                var _a, _b, _c;
                // Only process lines that start with a markdown list item
                if (line.trim().startsWith('-')) {
                    // Extract leading spaces to maintain indentation
                    const leadingSpaces = (_b = (_a = line.match(/^\s*/)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '';
                    const [, markdownListItem, number, text] = (_c = line.match(/^(\s*-\s*)(\d+\.)?(.*)$/)) !== null && _c !== void 0 ? _c : ['', '', '', ''];
                    if (text) {
                        // Replace dashes and spaces with underscores in the text, and make lowercase
                        const updatedText = text.replace(/[- ]/g, '_').toLowerCase();
                        // Reconstruct the line with the original structure, including leading spaces and markdown list item
                        return `${leadingSpaces}${markdownListItem}${number ? number : ''}${updatedText}`;
                    }
                }
                // Return the line unchanged if it does not start with a markdown list item
                return line;
            })
                .join('\n');
            yield fs_1.promises.writeFile(outputFilePath, updatedContent);
            console.log(`${outputFilePath} has been created with the updated content.`);
        }
        catch (error) {
            console.error('Error processing the file:', error);
        }
    });
}
const inputFilePath = path_1.default.join(__dirname, 'output.md');
const outputFilePath = path_1.default.join(__dirname, 'finalOutput.md');
updateOutputMd(inputFilePath, outputFilePath);
