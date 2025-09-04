```markdown
# Armenian Ai Vector Search

A TypeScript web API for text ingestion, vectorization, and LLM-powered question answering.

## Features

- Text ingestion with automatic chunking
- Vector embeddings using sentence-transformers
- Cosine similarity search
- LLM integration with streaming responses
- Local JSON-based vector storage

## Quick Start

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Production

```bash
npm run build
npm start
```

### Seed Sample Data

```bash
npm run seed
```
## API docs
- Located in docs/swagger.yml
- Open with online editor: 


## Technical Choices

### Embedding Model
- Using `all-MiniLM-L6-v2` via Xenova/transformers
- Runs locally on CPU
- Good balance of quality and performance

### LLM Integration
- Mock LLM for testing
- Streaming via SSE

### Storage
- Local JSON file for simplicity