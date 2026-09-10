# Frontend Setup Guide

## Prerequisites
- Node.js 18+
- npm or yarn

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000` and automatically proxies API calls to `http://localhost:8000`.

## Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

## Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:8000/api
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Top header component
│   │   ├── DecisionForm.jsx      # Form for creating decisions
│   │   ├── DecisionList.jsx      # List and filter decisions
│   │   ├── Tabs.jsx              # Tab navigation
│   │   └── Container.jsx         # Layout wrapper
│   ├── api.js                    # API client
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Tailwind CSS setup
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Features

### Decision Creation
- Manual entry of decision details
- AI-powered extraction from text (emails, meeting notes, etc.)
- Quick form for capturing stakeholders, risks, and expected outcomes

### Decision Viewing
- List all recorded decisions
- Filter by status and department
- View decision details, reasoning, and outcomes
- See confidence scores for AI-extracted decisions

### Responsive Design
- Mobile-friendly interface
- Built with Tailwind CSS for quick styling
- Fully accessible components
