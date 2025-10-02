# Contextual Video RAG

Advanced retrieval-augmented generation for video content that combines frame extraction, contextual compression and semantic retrieval to surface the most relevant segments of a video when answering a user's query.

## ✨ Key Features

- **Contextual Compression** – Reduce video length while retaining the most important context.
- **Window Based Retrieval** – Retrieve segments together with surrounding context windows to preserve flow.
- **Semantic Filtering** – Filter frames and chunks with embedding similarity to the user query.
- **Hierarchical Search** – Multi-level search strategy that moves from coarse to fine grained chunks.
- **Adaptive Context** – Dynamically adapts window size based on query complexity.
- **Custom Mode** – Bring your own prompt for bespoke RAG workflows.

## 🖥️ UI Walk-through

1. **Upload Video** – drag & drop a video. The app extracts up to 12 evenly-spaced frames in the browser – no server required.
2. **Configure RAG** – choose a mode, tune query parameters or provide a custom prompt.
3. **Run Analysis** – frames are sent to the Gemini model together with the generated prompt.
4. **Explore Results** – switch between Overview, Retrieval, Contextual, Knowledge and Insights tabs to inspect the JSON that Gemini returns.

## 🚀 Quick Start

```bash
# inside the contextual-video-rag folder
npm install   # or pnpm / yarn
npm run dev   # starts Vite dev server on http://localhost:5173    
```

Create a `.env` file (or export an env var) containing your Gemini API key:

```bash
GEMINI_API_KEY=your_key_here
```

## 🏗️ Tech Stack

- React 19 + TypeScript
- Vite 6
- TailwindCSS for styling
- Google Gemini 1.5-flash via `@google/genai`

## 📁 Project Structure

```
.
├─ components/          # React UI components (VideoInput, Loader, RAGOptions, RAGResults)
├─ services/            # Thin wrappers around Gemini SDK
├─ utils/               # Prompt generation & local processing helpers
├─ constants.ts         # Tunable parameters & enums
├─ types.ts             # Shared TypeScript types
└─ index.tsx            # Application entry point
```

## ⚖️ License

Released under the MIT license – see root LICENSE file for full text.

---
Made with 💜 by the Awesome-AI-Apps community. 