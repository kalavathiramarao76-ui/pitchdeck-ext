# DeckForge — AI Pitch Deck Generator

![Version](https://img.shields.io/badge/version-0.0.0-F59E0B)
![License](https://img.shields.io/badge/license-ISC-green)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

> Generate investor-ready pitch decks, scripts, and emails with AI — powered by live data from Crunchbase and AngelList.

---

## Features

- :clipboard: **Full 10-Slide Deck Generation** — Problem, Solution, Market, Product, Traction, Business Model, Team, Competition, Financials, Ask
- :pencil: **Slide Writer** — AI-generated content for each individual slide with industry-specific insights
- :email: **Investor Email Generator** — Craft personalized cold outreach emails for investors
- :microphone: **Pitch Script Generator** — Full speaking scripts with timing cues for each slide
- :crossed_swords: **Competition Matrix** — Auto-generated competitive landscape analysis
- :globe_with_meridians: **Crunchbase Integration** — Pull company data, funding history, and market intelligence automatically
- :angel: **AngelList Integration** — Access investor profiles and startup ecosystem data
- :new_moon: **Amber/Dark Theme** — Sleek dark UI with amber accents for focused work sessions

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Vite 8** | Build tool & dev server |
| **Firebase** | Authentication & data storage |
| **Chrome Extensions API** | Browser integration & data extraction |

---

## Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pitchdeck-ext.git
   cd pitchdeck-ext
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load into Chrome**
   - Open `chrome://extensions/`
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `dist/` folder

### Development Mode

```bash
npm run dev
```
Starts the Vite development server with hot module replacement.

---

## Usage

### Generating a Full Pitch Deck
1. Open the **DeckForge** side panel from the Chrome toolbar
2. Enter your **startup name**, **industry**, and **key metrics**
3. Click **Generate Deck** to create all 10 slides:
   - Problem | Solution | Market Size | Product | Traction
   - Business Model | Team | Competition | Financials | The Ask
4. Edit any slide individually using the **Slide Writer**

### Using Data Integrations
1. Navigate to a company page on **Crunchbase** or **AngelList**
2. DeckForge automatically extracts relevant data (funding rounds, competitors, market size)
3. Extracted data is used to populate deck slides with real figures

### Generating Investor Emails
1. Open the **Investor Email** tab
2. Select the investor profile or enter details manually
3. Choose email style (formal, conversational, data-driven)
4. Generate and customize the outreach email

### Creating Pitch Scripts
1. After generating your deck, navigate to **Pitch Script**
2. DeckForge creates a full speaking script with **timing cues** per slide
3. Practice mode shows slide-by-slide scripts with suggested duration

### Competition Matrix
1. Open the **Competition** section
2. Enter competitor names or let DeckForge auto-detect from Crunchbase
3. View a feature-comparison matrix with your startup positioned

---

## Architecture

```
pitchdeck-ext/
├── src/
│   ├── popup/              # Extension popup UI
│   ├── sidepanel/          # Full deck creation workspace
│   ├── background/         # Service worker & API orchestration
│   ├── content/            # Content scripts for Crunchbase/AngelList
│   ├── shared/             # Shared utilities, types, constants
│   ├── components/         # Reusable React components
│   └── utils/              # Helper functions
├── public/
│   └── icons/              # Extension icons (16, 48, 128px)
├── dist/                   # Built extension output
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
└── manifest.json           # Chrome extension manifest
```

---

## Screenshots

<p align="center">
  <img src="public/icons/icon128.png" alt="DeckForge Icon" width="128" height="128" />
</p>

| Icon Size | Path |
|---|---|
| 16x16 | `public/icons/icon16.png` |
| 48x48 | `public/icons/icon48.png` |
| 128x128 | `public/icons/icon128.png` |

---

## License

ISC
