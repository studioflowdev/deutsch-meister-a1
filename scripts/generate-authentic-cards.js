
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import https from 'https';

// Setup __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocalPath = path.resolve(__dirname, '../.env.local');
const OutputDir = path.join(__dirname, '../public/cards');

// Load environment variables
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
} else {
    dotenv.config();
}

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
    console.error("Error: API Key not found (checked GEMINI_API_KEY, VITE_GEMINI_API_KEY, API_KEY).");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

const SPEAKING_PICTURE_CARDS = [
    { id: 'sp1', content: 'Fenster aufmachen' },
    { id: 'sp2', content: 'Stift leihen' },
    { id: 'sp3', content: 'Tür zumachen' },
    { id: 'sp4', content: 'Rauchen verboten' },
    { id: 'sp5', content: 'Rechnung bezahlen' },
    { id: 'sp6', content: 'Milch kaufen' },
    { id: 'sp7', content: 'Buch lesen' },
    { id: 'sp8', content: 'Kaffee trinken' },
    { id: 'sp9', content: 'Ruhe bitte' },
    { id: 'sp10', content: 'Telefonieren' },
    { id: 'sp11', content: 'Platz nehmen' },
    { id: 'sp12', content: 'Unterschreiben' },
    { id: 'sp13', content: 'Taxi rufen' },
    { id: 'sp14', content: 'Uhrzeit sagen' },
    { id: 'sp15', content: 'Wasser geben' },
    { id: 'sp16', content: 'Tasche tragen' },
    { id: 'sp17', content: 'Compact Disc' },
    { id: 'sp18', content: 'Stuhl' },
    { id: 'sp19', content: 'Apfel' },
    { id: 'sp20', content: 'Koffer' },
    { id: 'sp21', content: 'Radio' }
];

async function generateCard(card) {
    const filePath = path.join(OutputDir, `${card.id}.png`);
    console.log(`Generating ${card.id}: ${card.content}...`);

    const prompt = `A single, bold, minimalist black-and-white ink line drawing of a "${card.content}". 
    STYLE: Thick felt-tip marker lines, high contrast, hand-drawn sketch feel, strictly NO shading, NO colors, NO background (pure white background). 
    Format: Iconographic and simple, similar to official Goethe-Zertifikat A1 Sprechen exam cards. 
    IMPORTANT: Do not include any text, words, letters, or numbers in the image. JUST THE OBJECT/ACTION.`;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: { aspectRatio: "1:1" }
            }
        });

        // Find inline data
        let foundData = null;
        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    foundData = part.inlineData.data;
                    break;
                }
            }
        }

        if (foundData) {
            fs.writeFileSync(filePath, Buffer.from(foundData, 'base64'));
            console.log(`Saved ${filePath}`);
        } else {
            console.error(`No image data returned for ${card.id}`);
        }

    } catch (error) {
        if (error.status === 404 || error.code === 404) {
            console.log(`Model 2.5 not found, trying fallback to gemini-2.0-flash-exp for SVG text?? No, ignoring.`);
            console.error("Model not found: gemini-2.5-flash-image");
        } else {
            console.error(`Error generating ${card.id}:`, error.message || error);
        }
    }
}

async function main() {
    if (!fs.existsSync(OutputDir)) {
        fs.mkdirSync(OutputDir, { recursive: true });
    }

    for (const card of SPEAKING_PICTURE_CARDS) {
        await generateCard(card);
        // Delay
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log("Done.");
}

main();
