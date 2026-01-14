
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

const FILES = [
    'MP_Start_Deutsch_1a_NP00810000001_Probe.pdf',
    'sd_1_modellsatz.pdf',
    'sd_1_uebungssatz02.pdf'
];

async function analyzePdfs() {
    const parts = [];

    // Add prompt
    parts.push({
        text: `You are an expert exam creator for the Goethe-Zertifikat A1. 
        Analyze the attached PDF exam papers (Start Deutsch 1).
        
        I need you to extract CONCRETE EXAMPLES to expand my exam simulator's content pool.
        Please look for:
        1. **READING (LESEN)**: Extract authentic reading comprehension texts (letters, ads, signs) and their True/False or Multiple Choice questions.
           - Part 1: Informal letters (True/False)
           - Part 2: Website/Ads (Multiple Choice a/b)
           - Part 3: Signs/Notices (True/False)
        
        2. **WRITING (SCHREIBEN)**: 
           - Part 1: Form filling scenarios (Description of a person + fields to fill).
           - Part 2: Letter/Email prompts (Situation + 3 points to cover).
        
        3. **SPEAKING (SPRECHEN)**:
           - Part 1: Self intro categories.
           - Part 2: Word cards + Topics.
           - Part 3: Picture cards (Request/Response).
        
        4. **LISTENING (HÖREN)**:
           - Extract the Transcripts (often at the end of the PDF) for Part 1, 2, and 3. Create questions based on them.
        
        OUTPUT FORMAT:
        Produce a JSON object with this structure:
        {
          "lesen": [ { "part": 1|2|3, "type": "true-false"|"multiple-choice", "context": "...", "prompt": "...", "options": [...], "correctAnswer": "...", "hint": "..." } ],
          "schreibenForm": [ { "description": "...", "fields": [...] } ],
          "schreibenLetter": [ { "prompt": "...", "hint": "...", "exampleEmail": "..." } ],
          "sprechenWords": [ { "topic": "...", "content": "...", "exampleQuestion": "...", "exampleAnswer": "..." } ],
          "sprechenPictures": [ { "content": "...", "exampleQuestion": "...", "exampleAnswer": "..." } ],
          "hoeren": [ { "part": 1|2|3, "type": "...", "audioScript": "...", "prompt": "...", "options": [...], "correctAnswer": "..." } ]
        }
        
        Extract as many distinct items as you can find in these files.
        IMPORTANT: Return ONLY valid JSON. No markdown formatting.
        `
    });

    // Add files
    for (const fileName of FILES) {
        const filePath = path.resolve(__dirname, `../examples/${fileName}`);
        if (fs.existsSync(filePath)) {
            console.log(`Reading ${fileName}...`);
            const buffer = fs.readFileSync(filePath);
            parts.push({
                inlineData: {
                    data: buffer.toString('base64'),
                    mimeType: 'application/pdf'
                }
            });
        } else {
            console.warn(`File not found: ${fileName}`);
        }
    }

    console.log("Sending to Gemini for analysis...");
    try {
        // Using a model capable of document reasoning. 
        // gemini-1.5-flash is a good balance.
        const response = await client.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{ role: "user", parts: parts }]
        });

        const text = response.candidates[0].content.parts[0].text;

        // Cleanup markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonStr);

        const outputPath = path.resolve(__dirname, 'extracted_exam_content.json');
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
        console.log(`Analysis complete! Saved to ${outputPath}`);
        console.log(`Found:`);
        console.log(`- Lesen: ${data.lesen?.length || 0}`);
        console.log(`- Schreiben Form: ${data.schreibenForm?.length || 0}`);
        console.log(`- Schreiben Letter: ${data.schreibenLetter?.length || 0}`);
        console.log(`- Sprechen Words: ${data.sprechenWords?.length || 0}`);
        console.log(`- Sprechen Pictures: ${data.sprechenPictures?.length || 0}`);
        console.log(`- Hoeren: ${data.hoeren?.length || 0}`);

    } catch (error) {
        console.error("Error during analysis:", error);
    }
}

analyzePdfs();
