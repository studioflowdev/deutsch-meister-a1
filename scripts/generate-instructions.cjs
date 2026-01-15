
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const client = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });

const INSTRUCTIONS = [
    {
        id: "instruction_sprechen_intro",
        text: "Guten Tag. Willkommen zur Prüfung Start Deutsch 1. Das ist der Teil Sprechen. Wir beginnen mit Teil 1: Sich vorstellen.",
        style: "Formal, welcoming, slow pace."
    },
    {
        id: "instruction_sprechen_part1",
        text: "Teil 1. Erzählen Sie bitte etwas über sich. Wer sind Sie? Hier sind einige Wörter zur Hilfe.",
        style: "Formal, clear, encouraging."
    },
    {
        id: "instruction_sprechen_part2",
        text: "Teil 2. Um Informationen bitten. Sie ziehen eine Karte und stellen eine Frage. Ihr Partner antwortet. Dann zieht der Partner eine Karte und fragt Sie.",
        style: "Formal, instructional."
    },
    {
        id: "instruction_sprechen_part3",
        text: "Teil 3. Bitten und Aufforderungen. Sie sehen ein Bild. Bitten Sie ihren Partner, etwas zu tun. Der Partner reagiert darauf.",
        style: "Formal, instructional."
    }
];

async function generateInstructions() {
    console.log("Generating examiner instructions...");

    for (const item of INSTRUCTIONS) {
        const filePath = path.join(process.cwd(), 'public', 'audio', `${item.id}.wav`);

        // Skip if exists (optional, but good for speed)
        // if (fs.existsSync(filePath)) continue;

        console.log(`Generating ${item.id}...`);

        const promptText = `
    # AUDIO PROFILE: Examiner
    ## Native German Speaker (Female)
    ## SCENE: Quiet exam room
    ### NOTES
    Style: ${item.style}
    Tone: Professional, calm, clear.
    #### TRANSCRIPT
    ${item.text}
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
                            prebuiltVoiceConfig: { voiceName: "Kore" }
                        }
                    }
                }
            });

            const audioData = response.candidates[0].content.parts[0].inlineData.data;
            const buffer = Buffer.from(audioData, 'base64');

            // Simple WAV Header (approximate mainly for players to recognize it) - same as previous script
            const wavHeader = Buffer.alloc(44);
            wavHeader.write('RIFF', 0);
            wavHeader.writeUInt32LE(36 + buffer.length, 4);
            wavHeader.write('WAVE', 8);
            wavHeader.write('fmt ', 12);
            wavHeader.writeUInt32LE(16, 16);
            wavHeader.writeUInt16LE(1, 20);
            wavHeader.writeUInt16LE(1, 22); // Mono
            wavHeader.writeUInt32LE(24000, 24); // Sample Rate
            wavHeader.writeUInt32LE(24000 * 2, 28); // Byte Rate
            wavHeader.writeUInt16LE(2, 32);
            wavHeader.writeUInt16LE(16, 34);
            wavHeader.write('data', 36);
            wavHeader.writeUInt32LE(buffer.length, 40);

            const fileData = Buffer.concat([wavHeader, buffer]);
            fs.writeFileSync(filePath, fileData);
            console.log(`Saved ${item.id}.wav`);

            // Rate limit safety
            await new Promise(r => setTimeout(r, 1000));

        } catch (error) {
            console.error(`Error ${item.id}:`, error.message);
        }
    }
}

generateInstructions();
