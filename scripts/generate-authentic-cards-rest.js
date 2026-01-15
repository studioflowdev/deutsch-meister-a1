
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config({ path: '.env.local' });

// Setup __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../public/cards');

const SPEAKING_PICTURE_CARDS = [
    { id: 'sp1', type: 'picture', content: 'Fenster aufmachen' },
    { id: 'sp2', type: 'picture', content: 'Stift leihen' },
    { id: 'sp3', type: 'picture', content: 'Tür zumachen' },
    { id: 'sp4', type: 'picture', content: 'Rauchen verboten' },
    { id: 'sp5', type: 'picture', content: 'Rechnung bezahlen' },
    { id: 'sp6', type: 'picture', content: 'Milch kaufen' },
    { id: 'sp7', type: 'picture', content: 'Buch lesen' },
    { id: 'sp8', type: 'picture', content: 'Kaffee trinken' },
    { id: 'sp9', type: 'picture', content: 'Ruhe bitte' },
    { id: 'sp10', type: 'picture', content: 'Telefonieren' },
    { id: 'sp11', type: 'picture', content: 'Platz nehmen' },
    { id: 'sp12', type: 'picture', content: 'Unterschreiben' },
    { id: 'sp13', type: 'picture', content: 'Taxi rufen' },
    { id: 'sp14', type: 'picture', content: 'Uhrzeit sagen' },
    { id: 'sp15', type: 'picture', content: 'Wasser geben' },
    { id: 'sp16', type: 'picture', content: 'Tasche tragen' },
    { id: 'sp17', type: 'picture', content: 'Compact Disc' },
    { id: 'sp18', type: 'picture', content: 'Stuhl' },
    { id: 'sp19', type: 'picture', content: 'Apfel' },
    { id: 'sp20', type: 'picture', content: 'Koffer' },
    { id: 'sp21', type: 'picture', content: 'Radio' }
];

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY or VITE_GEMINI_API_KEY is not set.");
    process.exit(1);
}

async function generateImage(card) {
    console.log(`Generating SVG for: ${card.id} - ${card.content}...`);

    const prompt = `Create a simple, black and white vector line art illustration of "${card.content}" as an SVG. 
    Style: Minimalist, dictionary icon, thick uniform strokes.
    IMPORTANT: Provide ONLY the raw SVG code. Do NOT use markdown code blocks. Do NOT include any <text> elements.`;

    const postData = JSON.stringify({
        contents: [{
            parts: [{ text: prompt }]
        }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);

                    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts[0].text) {
                        let svgContent = response.candidates[0].content.parts[0].text;

                        // Clean up markdown code blocks if present
                        svgContent = svgContent.replace(/```svg/g, '').replace(/```/g, '').trim();

                        // Force black stroke if missing (optional hack, but AI usually does it)

                        const filePath = path.join(OUTPUT_DIR, `${card.id}.svg`);
                        fs.writeFileSync(filePath, svgContent);
                        console.log(`Saved: ${filePath}`);
                        resolve();
                    } else {
                        console.error(`Unexpected response for ${card.id}:`, JSON.stringify(response).substring(0, 200));
                        resolve();
                    }
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    resolve();
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request Error for ${card.id}:`, e);
            resolve();
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Process sequentially
    for (const card of SPEAKING_PICTURE_CARDS) {
        await generateImage(card);
        // Small delay to avoid rate limits (though Imagen limits are usually lower)
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log("Done.");
}

main();
