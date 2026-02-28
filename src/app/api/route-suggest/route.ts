import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const THEME_CONTEXTS: Record<string, { name: string; context: string; focus: string }> = {
  hajj: {
    name: "Hajj",
    context: "Hajj pilgrimage in Makkah and Madinah",
    focus: "Mashair Railway (the green train connecting holy sites), walking when possible (spiritual and sustainable), avoiding single-use plastics, sharing transport, off-peak travel to reduce congestion, refilling water bottles at ZamZam stations"
  },
  umrah: {
    name: "Umrah",
    context: "Umrah pilgrimage in Makkah and Madinah",
    focus: "Walking between sites for spiritual reflection, public transport, avoiding plastic bottles, eco-friendly accommodations, respecting the sacred environment"
  },
  riyadh_festival: {
    name: "Riyadh Season",
    context: "Riyadh Season entertainment festival",
    focus: "Metro transit system, shared rides to event zones, reusable cups at venues, walking between nearby attractions, carpooling with other visitors"
  },
  alula: {
    name: "AlUla",
    context: "visiting the ancient heritage site of AlUla",
    focus: "Electric shuttle buses, walking tours through heritage sites, respecting the natural desert environment, sustainable tourism practices, minimizing footprint in archaeological areas"
  },
  jeddah: {
    name: "Jeddah",
    context: "visiting Jeddah's historic district and waterfront",
    focus: "Walking in Al-Balad historic district, waterfront promenades, shared taxis, avoiding single-use plastics near the Red Sea, eco-friendly beach practices"
  },
  other: {
    name: "Saudi Arabia",
    context: "traveling around Saudi Arabia",
    focus: "Public transport where available, carpooling, respecting local environments, reducing plastic waste, sustainable tourism practices"
  }
};

function getSystemPrompt(theme: string) {
  const themeInfo = THEME_CONTEXTS[theme] || THEME_CONTEXTS.hajj;
  
  return `You are GreenSaudi Route Advisor, an AI helping travelers explore Saudi Arabia sustainably during ${themeInfo.context}.

When shown an image, analyze it and provide personalized sustainable travel advice.

Your response should be helpful, encouraging, and specific to the ${themeInfo.name} context.

Respond ONLY with valid JSON in this exact format:
{
  "location_detected": "description of what you see in the image",
  "current_situation": "brief assessment of where they might be",
  "sustainable_recommendations": [
    {
      "title": "short title",
      "description": "detailed recommendation",
      "co2_saved": "estimated CO2 savings",
      "difficulty": "easy|moderate|challenging"
    }
  ],
  "green_transport_options": [
    {
      "mode": "train|bus|walk|shuttle|metro",
      "name": "specific name if applicable",
      "why_sustainable": "reason this is eco-friendly",
      "tip": "practical tip for using this"
    }
  ],
  "avoid_list": ["things to avoid for sustainability"],
  "spiritual_reminder": "a brief reminder about caring for creation and the environment",
  "points_potential": number (5-50 based on effort level)
}

Focus on:
- ${themeInfo.focus}

Be encouraging and practical. Make sustainability feel achievable during ${themeInfo.name}.`;
}

export async function POST(request: NextRequest) {
  try {
    const { image, origin, destination, theme = "hajj" } = await request.json();
    
    const themeInfo = THEME_CONTEXTS[theme] || THEME_CONTEXTS.hajj;

    const hasImage = image && image.length > 100;
    const imageUrl = hasImage 
      ? (image.includes("data:") ? image : `data:image/jpeg;base64,${image}`)
      : null;

    const userMessage = hasImage
      ? `I'm a traveler during ${themeInfo.name}. Please analyze this image and give me sustainable travel recommendations. ${origin ? `I'm traveling from ${origin}` : ""} ${destination ? `to ${destination}` : ""}`
      : `I'm a traveler during ${themeInfo.name} going from ${origin || "my location"} to ${destination || "my destination"}. What are the most sustainable ways to travel?`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any[] = [
      { role: "system", content: getSystemPrompt(theme) },
      {
        role: "user",
        content: hasImage
          ? [
              { type: "text", text: userMessage },
              { type: "image_url", image_url: { url: imageUrl, detail: "low" } }
            ]
          : userMessage
      }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return NextResponse.json(getMockRouteResult(origin, destination));
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      console.error("Failed to parse OpenAI response:", text);
    }

    return NextResponse.json(getMockRouteResult(origin, destination));
  } catch (error) {
    console.error("Route API error:", error);
    return NextResponse.json(getMockRouteResult());
  }
}

function getMockRouteResult(origin?: string, destination?: string) {
  return {
    location_detected: "Unable to analyze image, providing general recommendations",
    current_situation: `Planning travel ${origin ? `from ${origin}` : ""} ${destination ? `to ${destination}` : "around the holy sites"}`,
    sustainable_recommendations: [
      {
        title: "Take the Mashair Railway",
        description: "The electric train connecting Mina, Muzdalifah, and Arafat is the most eco-friendly option during Hajj days. It runs on clean energy and reduces road congestion significantly.",
        co2_saved: "1.2kg per trip",
        difficulty: "easy"
      },
      {
        title: "Walk During Off-Peak Hours",
        description: "Consider walking to nearby sites early morning after Fajr or during mid-afternoon. It's both sustainable and spiritually rewarding.",
        co2_saved: "0.5kg per km",
        difficulty: "moderate"
      },
      {
        title: "Use Shared Shuttle Services",
        description: "Hotel shuttles and shared buses are much more efficient than private cars. Coordinate with fellow pilgrims for shared transport.",
        co2_saved: "0.8kg per trip",
        difficulty: "easy"
      }
    ],
    green_transport_options: [
      {
        mode: "train",
        name: "Mashair Railway",
        why_sustainable: "Electric-powered, high capacity, zero direct emissions",
        tip: "Book tickets in advance through official Hajj apps"
      },
      {
        mode: "walk",
        name: "Pedestrian Routes",
        why_sustainable: "Zero emissions, connects with spiritual practice",
        tip: "Use shaded pathways and carry a reusable water bottle"
      },
      {
        mode: "bus",
        name: "Makkah Metro Bus",
        why_sustainable: "Shared transport reduces per-person emissions",
        tip: "Travel during off-peak hours for comfort"
      }
    ],
    avoid_list: [
      "Private cars during peak Hajj days",
      "Unnecessary trips - combine errands",
      "Single-use plastic bottles - use ZamZam stations",
      "Idling vehicles - turn off engines when waiting"
    ],
    spiritual_reminder: "\"The Earth is green and beautiful, and Allah has appointed you His stewards over it.\" - Prophet Muhammad ﷺ",
    points_potential: 25
  };
}
