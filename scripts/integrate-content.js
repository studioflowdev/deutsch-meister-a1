
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONSTANTS_PATH = path.resolve(__dirname, '../constants.tsx');
const DATA_PATH = path.resolve(__dirname, 'extracted_new_media_content.json');

function integrateContent() {
    if (!fs.existsSync(CONSTANTS_PATH) || !fs.existsSync(DATA_PATH)) {
        console.error("Files not found");
        return;
    }

    let constantsContent = fs.readFileSync(CONSTANTS_PATH, 'utf8');
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

    // Helper to generate ID
    const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. Integrate LESEN (Reading)
    // Filter for valid reading parts (1, 2, 3) and ensure context exists
    const validLesen = data.lesen.filter(item =>
        (item.part === 1 || item.part === 2 || item.part === 3) &&
        item.context &&
        item.correctAnswer
    );

    if (validLesen.length > 0) {
        let lesenString = '\n  // --- NEW IMPORTED CONTENT ---\n';
        validLesen.forEach(item => {
            lesenString += `  {
    id: '${generateId('l_new')}',
    part: ${item.part},
    type: '${item.type}',
    context: ${JSON.stringify(item.context)},
    prompt: ${JSON.stringify(item.prompt)},
    options: ${JSON.stringify(item.options)},
    correctAnswer: ${JSON.stringify(item.correctAnswer)},
    hint: ${JSON.stringify(item.hint || 'No hint available')}
  },\n`;
        });

        // Insert before the closing bracket of LESEN_POOL
        const lesenEndIndex = constantsContent.lastIndexOf('export const SCHREIBEN_FORM_POOL');
        const lesenInsertPoint = constantsContent.lastIndexOf('];', lesenEndIndex);

        if (lesenInsertPoint !== -1) {
            constantsContent = constantsContent.slice(0, lesenInsertPoint) + lesenString + constantsContent.slice(lesenInsertPoint);
            console.log(`Added ${validLesen.length} Reading questions.`);
        }
    }

    // 2. Integrate SCHREIBEN FORM (Writing)
    if (data.schreibenForm && data.schreibenForm.length > 0) {
        let formString = '\n  // --- NEW IMPORTED CONTENT ---\n';
        data.schreibenForm.forEach(item => {
            if (item.description && item.fields) {
                formString += `  {
    id: '${generateId('sf_new')}',
    type: 'form',
    description: ${JSON.stringify(item.description)},
    fields: ${JSON.stringify(item.fields)}
  },\n`;
            }
        });

        const formEndIndex = constantsContent.lastIndexOf('export const SCHREIBEN_LETTER_POOL');
        const formInsertPoint = constantsContent.lastIndexOf('];', formEndIndex);

        if (formInsertPoint !== -1) {
            constantsContent = constantsContent.slice(0, formInsertPoint) + formString + constantsContent.slice(formInsertPoint);
            console.log(`Added ${data.schreibenForm.length} Writing Forms.`);
        }
    }

    // 3. Integrate SCHREIBEN LETTER (Writing)
    if (data.schreibenLetter && data.schreibenLetter.length > 0) {
        let letterString = '\n  // --- NEW IMPORTED CONTENT ---\n';
        data.schreibenLetter.forEach(item => {
            if (item.prompt) {
                letterString += `  {
    id: '${generateId('sl_new')}',
    prompt: ${JSON.stringify(item.prompt)},
    hint: ${JSON.stringify(item.hint || 'Write 30 words covering the points.')},
    exampleEmail: ${JSON.stringify(item.exampleEmail || '')}
  },\n`;
            }
        });

        const letterEndIndex = constantsContent.lastIndexOf('export const SPEAKING_WORD_CARDS');
        const letterInsertPoint = constantsContent.lastIndexOf('];', letterEndIndex);

        if (letterInsertPoint !== -1) {
            constantsContent = constantsContent.slice(0, letterInsertPoint) + letterString + constantsContent.slice(letterInsertPoint);
            console.log(`Added ${data.schreibenLetter.length} Writing Letters.`);
        }
    }

    fs.writeFileSync(CONSTANTS_PATH, constantsContent);
    console.log("Integration complete!");
}

integrateContent();
