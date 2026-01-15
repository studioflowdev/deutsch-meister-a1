
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
    { id: 'sp_new1', type: 'picture', content: 'Tasche' },
    { id: 'sp_new2', type: 'picture', content: 'CD' },
    { id: 'sp_new3', type: 'picture', content: 'Rauchen verboten' },
    { id: 'sp_new4', type: 'picture', content: 'Zeitung' },
    { id: 'sp_new5', type: 'picture', content: 'Schlüssel' },
    { id: 'sp_new6', type: 'picture', content: 'Apfel' },
    { id: 'sp_new7', type: 'picture', content: 'Auto' },
    { id: 'sp_new8', type: 'picture', content: 'Briefmarke' },
    { id: 'sp_new9', type: 'picture', content: 'Fahrkarte' },
    { id: 'sp_new10', type: 'picture', content: 'Buch' },
    { id: 'sp_new11', type: 'picture', content: 'Stift' },
    { id: 'sp_new12', type: 'picture', content: 'Glas Wasser' },
    { id: 'sp_new13', type: 'picture', content: 'Tür' },
    { id: 'sp_new14', type: 'picture', content: 'Jacke' },
    { id: 'sp_new15', type: 'picture', content: 'Besteck' },
    { id: 'sp_new16', type: 'picture', content: 'Ausweis' },
    { id: 'sp_new17', type: 'picture', content: 'Flasche' },
    { id: 'sp_new18', type: 'picture', content: 'Brot' },
    { id: 'sp_new19', type: 'picture', content: 'Kamera' },
    { id: 'sp_new20', type: 'picture', content: 'Geld' },
    { id: 'sp_new21', type: 'picture', content: 'Kreditkarte' },
    { id: 'sp_new22', type: 'picture', content: 'Blumen' },
    { id: 'sp_new23', type: 'picture', content: 'Koffer' },
    { id: 'sp_new24', type: 'picture', content: 'Radio' },
    { id: 'sp_new25', type: 'picture', content: 'Stuhl' },
    { id: 'sp_new26', type: 'picture', content: 'Uhr' },
    { id: 'sp_new27', type: 'picture', content: 'Taxi' },
    { id: 'sp_new28', type: 'picture', content: 'Rechnung' }
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
