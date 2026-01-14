# Deutsch-Meister A1 - Antigravity Reference

## Project Overview
**Deutsch-Meister A1** is a comprehensive Goethe-Zertifikat A1 simulation application. It automates the generation of exam materials (Listening, Reading, Writing, Speaking) using generative AI, providing a dynamic and infinite practice environment for students.

## Tech Stack
- **Framework**: React (v19) with Vite (v6)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (inferred)
- **AI Integration**: Google Gemini API (`@google/genai` SDK)
- **Icons**: FontAwesome (inferred from class names like `fa-solid`)

## Architecture
### Core Components
- **`App.tsx`**: Main application state manager. Handles routing between exam sections (`HOEREN`, `LESEN`, `SCHREIBEN`, `SPRECHEN`, `SUMMARY`, `RESULTS`).
- **`services/gemini.ts`**: Centralized service for AI interactions.
    - `generateTTS`: Text-to-Speech for listening exercises.
    - `generateSketch`: Visual generation for Speaking cards (Sketch style).
    - `gradeWriting`: Automated grading of the writing task.
    - `getWritingAnalysis`: Detailed feedback on writing.

### Data Flow
- **Exam State**: Managed in `App.tsx` via `ExamState` interface.
- **Content Generation**: Triggered in `startExam`. Generates a unique `SessionContent` object containing randomized questions and AI-generated assets.

## Configuration
- **Environment**: Requires `GEMINI_API_KEY` in `.env.local`.
- **Vite Config**: Maps `env.GEMINI_API_KEY` to `process.env.API_KEY` for client-side access.

## Current Status
- Dependencies installed.
- Ready for local development server startup (`npm run dev`).
