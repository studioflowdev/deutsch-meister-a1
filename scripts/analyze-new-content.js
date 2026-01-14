
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocalPath = path.resolve(__dirname, '../.env.local');

let apiKey = process.env.GEMINI_API_KEY;

if (fs.existsSync(envLocalPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    if (envConfig.GEMINI_API_KEY) {
        apiKey = envConfig.GEMINI_API_KEY;
    }
}

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

// Directory containing new examples
const EXAMPLES_DIR = path.resolve(__dirname, '../examples');
const TARGET_FILE = 'sd_1_uebungssatz01.pdf';

async function analyzeMedia() {
    const filePath = path.join(EXAMPLES_DIR, TARGET_FILE);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    console.log(`Analyzing ${TARGET_FILE}...`);
    const parts = [];
    const buffer = fs.readFileSync(filePath);

    parts.push({
        inlineData: {
            data: buffer.toString('base64'),
            mimeType: 'application/pdf'
        }
    });

    // Add prompt
    parts.unshift({
        text: `You are an expert exam creator for the Goethe-Zertifikat A1. 
        Analyze the attached PDF (Start Deutsch 1).
        
        Focus on the SPRECHEN (Speaking) section.
        
        Extract:
        1. **Teil 2 Themes & Words**: Identify the themes (e.g. "Essen und Trinken") and the specific words on the cards.
        2. **Teil 3 Images**: Describe the images used for requests (Bitte).
        
        OUTPUT FORMAT (JSON):
        {
          "sprechenWords": [ { "topic": "...", "content": "...", "exampleQuestion": "...", "exampleAnswer": "..." } ],
          "sprechenPictures": [ { "content": "Description of image", "exampleQuestion": "...", "exampleAnswer": "..." } ]
        }
        `
    });

    let combinedData = {
        sprechenWords: [],
        sprechenPictures: []
    };

    const outputPath = path.resolve(__dirname, 'extracted_new_media_content.json');
    fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2));
    console.log(`\nAnalysis complete! Saved to ${outputPath}`);
    console.log(`Total Found:`);
    console.log(`- Lesen: ${combinedData.lesen.length}`);
    console.log(`- Schreiben Form: ${combinedData.schreibenForm.length}`);
    console.log(`- Schreiben Letter: ${combinedData.schreibenLetter.length}`);
    console.log(`- Sprechen Words: ${combinedData.sprechenWords.length}`);
    console.log(`- Sprechen Pictures: ${combinedData.sprechenPictures.length}`);
    console.log(`- Hoeren: ${combinedData.hoeren.length}`);
}

analyzeMedia();
