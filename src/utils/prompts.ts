export const ELEVATOR_PITCH_PROMPT = `Generate a compelling 30-second elevator pitch for the startup.
Keep it punchy, memorable, and investor-ready. Structure: Hook → Problem → Solution → Traction/Ask.
Output ONLY the pitch text, no headings or labels.`

export const DECK_SLIDES = [
  'Title Slide',
  'Problem',
  'Solution',
  'Market Opportunity',
  'Business Model',
  'Traction & Metrics',
  'Go-to-Market Strategy',
  'Competitive Landscape',
  'Team',
  'Financial Projections & Ask',
] as const

export const SLIDE_WRITER_PROMPT = `Write detailed, investor-ready content for the following pitch deck slide.
Include key talking points, data suggestions, and compelling narrative.
Format with clear sections using markdown.`

export const INVESTOR_EMAIL_PROMPT = `Write a concise, professional cold email to a potential investor.
Include: compelling subject line, brief intro, key metrics, clear ask.
Keep it under 200 words. Format as:
Subject: ...

Body of email`

export const PITCH_SCRIPT_PROMPT = `Write a detailed 5-minute pitch presentation script.
Include speaker notes, timing cues, and transition phrases.
Structure it slide-by-slide with natural delivery cues.`

export const COMPETITION_MATRIX_PROMPT = `Create a competitive analysis matrix. For each competitor, analyze:
- Core offering
- Target market
- Pricing model
- Key strengths
- Key weaknesses
- Differentiator vs. this startup

Format as a structured comparison. Include at least 4 competitors.`

export const CONTENT_SCRIPT_PROMPT = `Based on the following company data extracted from a startup profile page, generate a quick pitch deck outline with key points for each slide. Be specific using the actual company data provided.`
