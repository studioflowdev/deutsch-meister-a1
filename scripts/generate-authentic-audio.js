
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
    apiKey = process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
}

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

// Copied HOEREN_POOL content
const HOEREN_POOL = [
    // --- PART 1: Short Conversations ---
    {
        id: 'h1_v1', part: 1, type: 'multiple-choice',
        prompt: 'Was möchte die Frau essen?',
        audioScript: 'Frau: Ich hätte gerne die Suppe. Mann: Tomatensuppe oder Gemüsesuppe? Frau: Die Tomatensuppe bitte.',
        options: ['Tomatensuppe', 'Gemüsesuppe', 'Salat'],
        correctAnswer: 'Tomatensuppe',
        // Audio Profile
        role: "Restaurant Guest and Waiter",
        scene: "A busy German restaurant. Background chatter (implied).",
        style: "Casual, polite, slightly hungry tone for the woman.",
        transcript: 'Frau: Ich hätte gerne die Suppe.\nMann: Tomatensuppe oder Gemüsesuppe?\nFrau: Die Tomatensuppe bitte.',
    },
    {
        id: 'h1_v2', part: 1, type: 'multiple-choice',
        prompt: 'Wie viel kostet der Pullover?',
        audioScript: 'Frau: Entschuldigung, wie viel kostet dieser rote Pullover? Verkäufer: Der kostet normalerweise 50 Euro, aber heute ist er im Angebot für 35 Euro.',
        options: ['50 Euro', '35 Euro', '15 Euro'],
        correctAnswer: '35 Euro',
        role: "Shopper and Salesperson",
        scene: "A clothing store.",
        style: "Inquisitive shopper, helpful and professional salesperson.",
        transcript: 'Frau: Entschuldigung, wie viel kostet dieser rote Pullover?\nVerkäufer: Der kostet normalerweise 50 Euro, aber heute ist er im Angebot für 35 Euro.',
    },
    {
        id: 'h1_v3', part: 1, type: 'multiple-choice',
        prompt: 'Wann kommt der Zug an?',
        audioScript: 'Frau: Entschuldigung, wann kommt der Zug aus Berlin? Mann: Er hat Verspätung. Planmäßig um 14:30 Uhr, aber er kommt erst um 14:45 Uhr.',
        options: ['14:15 Uhr', '14:30 Uhr', '14:45 Uhr'],
        correctAnswer: '14:45 Uhr',
        role: "Traveler and Information Desk",
        scene: "Noisy train station platform.",
        style: "Stressed traveler, calm and informative official.",
        transcript: 'Frau: Entschuldigung, wann kommt der Zug aus Berlin?\nMann: Er hat Verspätung. Planmäßig um 14:30 Uhr, aber er kommt erst um 14:45 Uhr.',
    },
    {
        id: 'h1_v4', part: 1, type: 'multiple-choice',
        prompt: 'Was soll Anja mitbringen?',
        audioScript: 'Mann: Hallo Anja. Kommst du heute Abend? Anja: Ja. Soll ich etwas mitbringen? Mann: Ja, bitte bring etwas zu essen mit, vielleicht Brot und Wurst. Getränke haben wir schon.',
        options: ['Getränke', 'Essen', 'Musik'],
        correctAnswer: 'Essen',
        role: "Friends on the phone",
        scene: "Casual phone call.",
        style: "Friendly, informal, making plans.",
        transcript: 'Mann: Hallo Anja. Kommst du heute Abend?\nAnja: Ja. Soll ich etwas mitbringen?\nMann: Ja, bitte bring etwas zu essen mit, vielleicht Brot und Wurst. Getränke haben wir schon.',
    },
    {
        id: 'h1_v5', part: 1, type: 'multiple-choice',
        prompt: 'Welche Nummer hat das Taxi?',
        audioScript: 'Mann: Ich brauche ein Taxi. Kennst du die Nummer? Frau: Ja, die ist 44 88 0. Mann: Danke, 44 88 0.',
        options: ['44 88 0', '48 84 0', '44 00 8'],
        correctAnswer: '44 88 0',
        role: "Couple at home",
        scene: "Quiet living room.",
        style: "Casual, exchanging information clearly.",
        transcript: 'Mann: Ich brauche ein Taxi. Kennst du die Nummer?\nFrau: Ja, die ist 44 88 0.\nMann: Danke, 44 88 0.',
    },
    {
        id: 'h1_v6', part: 1, type: 'multiple-choice',
        prompt: 'Wo ist die Apotheke?',
        audioScript: 'Frau: Entschuldigung, wo ist hier eine Apotheke? Mann: Gehen Sie hier geradeaus und dann die zweite Straße links. Neben der Bäckerei.',
        options: ['Neben der Post', 'Neben der Bäckerei', 'Gegenüber vom Bahnhof'],
        correctAnswer: 'Neben der Bäckerei',
        role: "Pedestrians on the street",
        scene: "City street.",
        style: "Polite stranger asking for help, helpful local giving directions.",
        transcript: 'Frau: Entschuldigung, wo ist hier eine Apotheke?\nMann: Gehen Sie hier geradeaus und dann die zweite Straße links. Neben der Bäckerei.',
    },
    {
        id: 'h1_v7', part: 1, type: 'multiple-choice',
        prompt: 'Was macht Herr Müller morgen?',
        audioScript: 'Frau: Gehen wir morgen ins Kino, Herr Müller? Herr Müller: Morgen kann ich leider nicht. Ich muss lange arbeiten, bis 20 Uhr.',
        options: ['Er geht ins Kino', 'Er muss arbeiten', 'Er spielt Fußball'],
        correctAnswer: 'Er muss arbeiten',
        role: "Colleagues",
        scene: "Office setting.",
        style: "Professional but friendly.",
        transcript: 'Frau: Gehen wir morgen ins Kino, Herr Müller?\nHerr Müller: Morgen kann ich leider nicht. Ich muss lange arbeiten, bis 20 Uhr.',
    },
    {
        id: 'h1_v8', part: 1, type: 'multiple-choice',
        prompt: 'Welches Gleis fährt der Zug?',
        audioScript: 'Mann: Entschuldigung, fährt der Zug nach München von Gleis 5? Schaffner: Nein, heute von Gleis 12. Gleis 5 ist gesperrt.',
        options: ['Gleis 5', 'Gleis 12', 'Gleis 2'],
        correctAnswer: 'Gleis 12',
        role: "Traveler and Conductor",
        scene: "Train station.",
        style: "Urgent query, clear official response.",
        transcript: 'Mann: Entschuldigung, fährt der Zug nach München von Gleis 5?\nSchaffner: Nein, heute von Gleis 12. Gleis 5 ist gesperrt.',
    },

    // --- PART 2: Announcements (SINGLE SPEAKER) ---
    {
        id: 'h2_v1', part: 2, type: 'true-false',
        prompt: 'Fahrgäste nach München sollen den Bus nehmen.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        role: "Station Announcer",
        scene: "Train station PA system.",
        style: "Professional, loud projection, echoing, slight reverb effect in voice.",
        transcript: 'Achtung am Gleis 4. Der Zug nach München fällt heute aus. Bitte benutzen Sie die Busse vor dem Bahnhof.',
    },
    {
        id: 'h2_v2', part: 2, type: 'true-false',
        prompt: 'Im Supermarkt kann man heute billig Fleisch kaufen.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        role: "Supermarket Announcer",
        scene: "Supermarket PA system.",
        style: "Upbeat, promotional, inviting.",
        transcript: 'Liebe Kunden, heute haben wir ein besonderes Angebot: Rindersteak für nur 2 Euro pro Kilo. Greifen Sie zu!',
    },
    {
        id: 'h2_v3', part: 2, type: 'true-false',
        prompt: 'Heute fahren keine U-Bahnen zum Südbahnhof.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        role: "Subway Announcer",
        scene: "Subway station.",
        style: "Formal, informative, apologizing for inconvenience.",
        transcript: 'Achtung, liebe Fahrgäste. Wegen Bauarbeiten fahren heute leider keine U-Bahnen zum Südbahnhof. Bitte nutzen Sie den Bus.',
    },
    {
        id: 'h2_v4', part: 2, type: 'true-false',
        prompt: 'Der Flug LH456 fliegt heute von Gate B12.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        role: "Airport Gate Agent",
        scene: "Airport gate area.",
        style: "Urgent, final call, professional.",
        transcript: 'Letzter Aufruf für alle Passagiere des Lufthansa-Fluges LH456 nach London. Bitte kommen Sie sofort zum Ausgang B12. Das Gate schließt in 5 Minuten.',
    },
    {
        id: 'h2_v5', part: 2, type: 'true-false',
        prompt: 'Das Möbelhaus schließt erst in einer Stunde.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Falsch',
        role: "Store Manager",
        scene: "Furniture store closing time.",
        style: "Polite but firm warning.",
        transcript: 'Werte Kunden, unser Möbelhaus schließt in 15 Minuten. Bitte gehen Sie zur Kasse. Wir wünschen Ihnen einen schönen Feierabend.',
    },
    {
        id: 'h2_v6', part: 2, type: 'true-false',
        prompt: 'Kinder unter 12 Jahren haben freien Eintritt.',
        options: ['Richtig', 'Falsch'],
        correctAnswer: 'Richtig',
        role: "Zoo Entrance Speaker",
        scene: "Zoo entrance.",
        style: "Friendly, welcoming, happy.",
        transcript: 'Willkommen im Zoo! Heute ist Kindertag. Alle Kinder unter 12 Jahren bezahlen heute keinen Eintritt. Viel Spaß!',
    }
];

// WAV Header Utility
function getWavHeader(dataLength, sampleRate, numChannels, bitsPerSample) {
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
    header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
    header.writeUInt16LE(bitsPerSample, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    return header;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateAuthenticAudio(item) {
    const outputPath = path.resolve(__dirname, `../public/audio/${item.id}.wav`);

    console.log(`Generating authentic audio for ${item.id}...`);

    // Construct the prompt based on Google's prompting guide
    const promptText = `
# AUDIO PROFILE: ${item.role}
## Native German Speaker(s)

## THE SCENE: ${item.scene}

### DIRECTOR'S NOTES
Style: ${item.style}
Accent: German (Germany)
Pace: Natural, conversational.

#### TRANSCRIPT
${item.transcript}
    `.trim();

    try {
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: {
                role: "user",
                parts: [{ text: promptText }]
            },
            config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: "Puck" } // Default nice voice, will be overridden by role acting
                    }
                }
            }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part && part.inlineData) {
            const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
            const header = getWavHeader(pcmBuffer.length, 24000, 1, 16);
            const wavBuffer = Buffer.concat([header, pcmBuffer]);

            fs.writeFileSync(outputPath, wavBuffer);
            console.log(`Saved ${item.id}.wav`);
        } else {
            console.error(`No audio data for ${item.id}. Response:`, JSON.stringify(response.candidates?.[0]));
        }

    } catch (error) {
        if (error.status === 429 || error.code === 429) {
            console.error("Rate limit hit. Waiting 60s...");
            await sleep(60000);
            return generateAuthenticAudio(item);
        }
        console.error(`Error generating ${item.id}:`, error.message);
        if (error.response) {
            console.error("Details:", JSON.stringify(error.response));
        }
    }
}

async function main() {
    console.log("Starting AUTHENTIC prompt-based audio generation...");
    console.log("Using model: gemini-2.5-flash-preview-tts");

    // Create directory if not exists
    const audioDir = path.resolve(__dirname, '../public/audio');
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    for (const item of HOEREN_POOL) {
        if (!item.transcript) continue; // Skip incomplete items for now to test the main ones
        await generateAuthenticAudio(item);
        await sleep(2000);
    }
    console.log("Audio generation complete!");
}

main();
