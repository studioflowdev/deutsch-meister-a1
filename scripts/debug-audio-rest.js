
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocalPath = path.resolve(__dirname, '../.env.local');

let apiKey = process.env.GEMINI_API_KEY;
if (fs.existsSync(envLocalPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    if (envConfig.GEMINI_API_KEY) apiKey = envConfig.GEMINI_API_KEY;
}
apiKey = apiKey || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
    console.error("No API Key");
    process.exit(1);
}

const prompt = `
Generate a realistic audio recording of a German train station announcement.
SCENE: Train station. SOUND: PA system speaker, reverb, noise.
TEXT: "Achtung am Gleis 5. Der Zug fährt ein."
`;

const postData = JSON.stringify({
    contents: [{
        parts: [{ text: prompt }]
    }],
    generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
            voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Puck" }
            }
        }
    }
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log("Testing Audio Gen via REST...");

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.error) {
                console.error("API Error:", JSON.stringify(response.error, null, 2));
            } else if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts[0].inlineData) {
                console.log("Success! Audio data received.");
                const audioData = response.candidates[0].content.parts[0].inlineData.data;
                fs.writeFileSync('test_audio.wav', Buffer.from(audioData, 'base64'));
                console.log("Saved test_audio.wav (needs PCM header probably)");
            } else {
                console.log("Unexpected response format:", JSON.stringify(response).substring(0, 500));
            }
        } catch (e) {
            console.error("Parse error:", e, data);
        }
    });
});

req.on('error', e => console.error("Request error:", e));
req.write(postData);
req.end();
