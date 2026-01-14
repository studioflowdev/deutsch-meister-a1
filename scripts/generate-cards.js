
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
    console.error("Error: GEMINI_API_KEY not found in environment variables or .env.local");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

// Define the cards directly here to avoid TS compilation issues
const SPEAKING_WORD_CARDS = [
    { id: 'sw1', content: 'Auto', type: 'word' },
    { id: 'sw2', content: 'Brot', type: 'word' },
    { id: 'sw3', content: 'Kaffee', type: 'word' },
    { id: 'sw4', content: 'Wochenende', type: 'word' },
    { id: 'sw5', content: 'Zeitung', type: 'word' },
    { id: 'sw6', content: 'Fahrrad', type: 'word' },
    { id: 'sw7', content: 'Wohnung', type: 'word' },
    { id: 'sw8', content: 'Beruf', type: 'word' },
    { id: 'sw9', content: 'Urlaub', type: 'word' },
    { id: 'sw10', content: 'Sport', type: 'word' },
    { id: 'sw11', content: 'Familie', type: 'word' },
    { id: 'sw12', content: 'Sprache', type: 'word' },
    { id: 'sw13', content: 'Obst', type: 'word' },
    { id: 'sw14', content: 'Arzt', type: 'word' },
    { id: 'sw15', content: 'Computer', type: 'word' },
    { id: 'sw16', content: 'Lust', type: 'word' },
    { id: 'sw17', content: 'Preis', type: 'word' },
    { id: 'sw18', content: 'Stadt', type: 'word' },
    { id: 'sw19', content: 'Freunde', type: 'word' },
    { id: 'sw20', content: 'Garten', type: 'word' },
    { id: 'sw21', content: 'Frühstück', type: 'word' },
    { id: 'sw22', content: 'Lieblingsessen', type: 'word' },
    { id: 'sw23', content: 'Fleisch', type: 'word' },
    { id: 'sw24', content: 'Arbeitszeit', type: 'word' },
    { id: 'sw25', content: 'Kollegen', type: 'word' },
    { id: 'sw26', content: 'Spaß', type: 'word' },
    { id: 'sw27', content: 'Schwimmen', type: 'word' },
    { id: 'sw28', content: 'Ball', type: 'word' }
];

const SPEAKING_PICTURE_CARDS = [
    { id: 'sp1', content: 'Fenster aufmachen', type: 'picture' },
    { id: 'sp2', content: 'Stift leihen', type: 'picture' },
    { id: 'sp3', content: 'Tür zumachen', type: 'picture' },
    { id: 'sp4', content: 'Rauchen verboten', type: 'picture' },
    { id: 'sp5', content: 'Rechnung bezahlen', type: 'picture' },
    { id: 'sp6', content: 'Milch kaufen', type: 'picture' },
    { id: 'sp7', content: 'Buch lesen', type: 'picture' },
    { id: 'sp8', content: 'Kaffee trinken', type: 'picture' },
    { id: 'sp9', content: 'Ruhe bitte', type: 'picture' },
    { id: 'sp10', content: 'Telefonieren', type: 'picture' },
    { id: 'sp11', content: 'Platz nehmen', type: 'picture' },
    { id: 'sp12', content: 'Unterschreiben', type: 'picture' },
    { id: 'sp13', content: 'Taxi rufen', type: 'picture' },
    { id: 'sp14', content: 'Uhrzeit sagen', type: 'picture' },
    { id: 'sp15', content: 'Wasser geben', type: 'picture' },
    { id: 'sp16', content: 'Tasche tragen', type: 'picture' },
    { id: 'sp17', content: 'CD', type: 'picture' },
    { id: 'sp18', content: 'Stuhl', type: 'picture' },
    { id: 'sp19', content: 'Apfel', type: 'picture' },
    { id: 'sp20', content: 'Koffer', type: 'picture' },
    { id: 'sp21', content: 'Radio', type: 'picture' }
];

async function generateCardImage(card) {
    const outputPath = path.resolve(__dirname, `../public/cards/${card.id}.png`);

    if (fs.existsSync(outputPath)) {
        console.log(`Skipping ${card.id} (${card.content}) - already exists`);
        return;
    }

    console.log(`Generating visual for ${card.id}: ${card.content}...`);

    const prompt = `A clear, realistic black-and-white line drawing of "${card.content}". 
      STYLE: Simple, distinct line art, like a dictionary illustration or clear clip art. 
      Easy to recognize. strictly NO shading, NO colors, NO background (pure white background). 
      DO NOT use abstract symbols. DRAW THE OBJECT REALISTICALLY.`;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash-image', // Updated model
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: { aspectRatio: "1:1" }
            }
        });

        const candidate = response.candidates?.[0];
        if (!candidate) {
            console.error("No candidates returned. Safety block?");
            return;
        }

        const part = candidate.content?.parts?.find(p => p.inlineData);

        if (part && part.inlineData) {
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            fs.writeFileSync(outputPath, buffer);
            console.log(`Saved ${card.id}.png`);
        } else {
            console.error(`Failed to generate image data for ${card.content}. Response might be text only?`);
        }
    } catch (error) {
        if ((error.status === 429 || error.code === 429)) {
            console.error("Rate limit hit. Waiting 60s...");
            await new Promise(resolve => setTimeout(resolve, 60000));
            return generateCardImage(card);
        }
        console.error(`Error generating ${card.content}:`, error.message);
    }
}

async function main() {
    console.log("Starting card generation...");

    const allCards = [...SPEAKING_WORD_CARDS, ...SPEAKING_PICTURE_CARDS];

    for (const card of allCards) {
        await generateCardImage(card);
        // 10s delay to stay under limits
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    console.log("Generation complete!");
}

main();
