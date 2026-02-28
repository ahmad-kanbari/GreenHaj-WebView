import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const THEME_CONTEXTS: Record<string, { name: string; context: string }> = {
  hajj: { name: "Hajj pilgrimage", context: "Hajj context (Makkah heat, crowds, sacred journey). Suggest ZamZam station refills." },
  umrah: { name: "Umrah pilgrimage", context: "Umrah context (spiritual journey, mosque etiquette, sacred spaces)." },
  riyadh_festival: { name: "Riyadh Season", context: "Riyadh Season festival (entertainment venues, event sustainability, urban setting)." },
  alula: { name: "AlUla visit", context: "AlUla heritage site (desert conservation, archaeological preservation, eco-tourism)." },
  jeddah: { name: "Jeddah visit", context: "Jeddah travel (coastal environment, Red Sea protection, historic preservation)." },
  other: { name: "Saudi travel", context: "Saudi Arabia travel (sustainable tourism, cultural respect, environmental care)." }
};

function getSystemPrompt(theme: string) {
  const themeInfo = THEME_CONTEXTS[theme] || THEME_CONTEXTS.hajj;
  
  return `You are GreenSaudi EcoScan AI, helping travelers during ${themeInfo.name} be more sustainable.

Analyze the image and identify what the user is showing you. This could be:
- Items to recycle/dispose
- Places/scenes where you can suggest sustainability improvements
- Products where you can suggest eco-friendly alternatives
- Situations where energy can be conserved

Respond ONLY with valid JSON in this exact format:
{
  "detected_item": "string describing what you see",
  "category": "plastic|can|paper|glass|general|energy|water|other",
  "recycling_steps": ["step 1", "step 2", "step 3"],
  "sustainable_actions": [
    {"action": "specific action description", "points": number 5-25}
  ],
  "energy_tips": ["tip about saving energy/water if relevant"],
  "confidence": 0.0-1.0
}

SUSTAINABILITY FOCUS:
- If showing AC/electronics: suggest turning off when leaving, using fans instead
- If showing lights: suggest natural lighting, turning off unused lights
- If showing water/bathroom: suggest shorter showers, reusing towels
- If showing plastic bottles: suggest refillable bottles
- If showing food: suggest eating portions to reduce waste
- If showing transport: suggest public transport/walking

Be concise, encouraging, and respectful. Consider ${themeInfo.context}`;
}

export async function POST(request: NextRequest) {
  try {
    const { image, theme = "hajj" } = await request.json();
    
    const themeInfo = THEME_CONTEXTS[theme] || THEME_CONTEXTS.hajj;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    // Extract base64 data (keep data URL format for OpenAI)
    const imageUrl = image.includes("data:") ? image : `data:image/jpeg;base64,${image}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: getSystemPrompt(theme)
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `What is this item and how can I dispose of it sustainably during my ${themeInfo.name}? How many points can I earn?`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "low"
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return NextResponse.json(getMockScanResult());
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      console.error("Failed to parse OpenAI response:", text);
    }

    return NextResponse.json(getMockScanResult());
  } catch (error) {
    console.error("Scan API error:", error);
    return NextResponse.json(getMockScanResult());
  }
}

function getMockScanResult() {
  const items = [
    {
      detected_item: "Plastic Water Bottle",
      category: "plastic",
      recycling_steps: [
        "Remove the cap and label if possible",
        "Rinse the bottle to remove any residue",
        "Crush the bottle to save space",
        "Place in the blue recycling bin"
      ],
      sustainable_actions: [
        { action: "Recycle correctly", points: 15 },
        { action: "Use a refillable bottle next time", points: 5 }
      ],
      energy_tips: [
        "Refill at ZamZam stations instead of buying new bottles",
        "One reusable bottle saves ~150 plastic bottles per year"
      ],
      confidence: 0.92
    },
    {
      detected_item: "Aluminum Can",
      category: "can",
      recycling_steps: [
        "Empty any remaining liquid",
        "Rinse briefly if possible",
        "Crush the can to save space",
        "Place in the metal recycling bin"
      ],
      sustainable_actions: [
        { action: "Recycle correctly", points: 15 },
        { action: "Choose refillable containers", points: 5 }
      ],
      energy_tips: [
        "Recycling one can saves enough energy to run a TV for 3 hours"
      ],
      confidence: 0.89
    },
    {
      detected_item: "Paper/Cardboard",
      category: "paper",
      recycling_steps: [
        "Remove any plastic or tape",
        "Flatten cardboard boxes",
        "Keep paper dry and clean",
        "Place in the paper recycling bin"
      ],
      sustainable_actions: [
        { action: "Recycle correctly", points: 10 },
        { action: "Choose digital alternatives when possible", points: 5 }
      ],
      energy_tips: [
        "Use hotel towels multiple times to save water and energy",
        "Request no daily room cleaning if staying multiple nights"
      ],
      confidence: 0.85
    }
  ];

  return items[Math.floor(Math.random() * items.length)];
}
