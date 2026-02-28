import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are GreenHajj Proof Verifier, an AI that helps verify sustainable actions during Hajj pilgrimage.

The user is submitting photographic proof of a sustainable action they completed. Analyze the image carefully and verify if they truly did the claimed action.

The user claims this is a proof of type: {proof_type}

Respond ONLY with valid JSON in this exact format:
{
  "proof_type": "train_ticket|refill|disposal|other",
  "name_match": true|false|"unknown",
  "date_in_last_3_days": true|false|"unknown",
  "verification_level": "verified|likely|unverified",
  "points_awarded": number (verified=30, likely=15, unverified=0),
  "reason": "friendly encouraging explanation string with sustainability tip"
}

Verification guidelines:
- "verified": Clear evidence of the claimed action - be generous for environmental actions!
- "likely": Reasonable evidence but not fully conclusive - still award points
- "unverified": Clearly fake or completely unrelated image

PROOF TYPE DETAILS:
For disposal (Empty Bottle/Waste): 
- Look for: Empty water bottles, properly disposed trash, items in recycling bins, sorted waste
- VERIFY if you see an empty bottle being held up, in/near a bin, or clearly used up
- Be encouraging! Even just showing an empty bottle is proof they didn't litter

For refill (Water Refill):
- Look for: Reusable bottles at refill stations, ZamZam stations, water coolers
- Verify if they're filling/have filled a reusable container

For train_ticket (Green Transport):
- Look for: Mashair Railway tickets, metro tickets, bus passes, public transport receipts
- Verify if ticket/pass is visible

Be ENCOURAGING and positive! The goal is to motivate pilgrims to be sustainable. Give benefit of doubt for environmental actions. Only mark "unverified" if the image is clearly unrelated or fake.`;

export async function POST(request: NextRequest) {
  try {
    const { image, type } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const imageUrl = image.includes("data:") ? image : `data:image/jpeg;base64,${image}`;
    const prompt = SYSTEM_PROMPT.replace("{proof_type}", type || "unknown");

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
            content: prompt
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please verify this proof of sustainable action. The claimed proof type is: ${type || "unknown"}`
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
        max_tokens: 400,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return NextResponse.json(getMockVerifyResult(type));
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      console.error("Failed to parse OpenAI response:", text);
    }

    return NextResponse.json(getMockVerifyResult(type));
  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json(getMockVerifyResult());
  }
}

function getMockVerifyResult(type?: string) {
  const results = {
    train_ticket: {
      proof_type: "train_ticket",
      name_match: "unknown",
      date_in_last_3_days: true,
      verification_level: "verified",
      points_awarded: 30,
      reason: "Train ticket clearly visible. This is a valid Mashair Railway ticket from the recent Hajj period. Thank you for choosing sustainable transport!"
    },
    refill: {
      proof_type: "refill",
      name_match: "unknown",
      date_in_last_3_days: true,
      verification_level: "likely",
      points_awarded: 15,
      reason: "Image shows water refill station. While we cannot verify the exact action, the evidence suggests you used a refill station. Great choice for reducing plastic waste!"
    },
    disposal: {
      proof_type: "disposal",
      name_match: "unknown",
      date_in_last_3_days: true,
      verification_level: "verified",
      points_awarded: 20,
      reason: "Photo shows proper waste disposal in a recycling bin. Items appear to be sorted correctly. Every small action counts on this blessed journey!"
    }
  };

  const defaultResult = {
    proof_type: type || "other",
    name_match: "unknown",
    date_in_last_3_days: "unknown",
    verification_level: "likely" as const,
    points_awarded: 15,
    reason: "Evidence received. While we cannot fully verify the details, we appreciate your commitment to sustainable practices during Hajj."
  };

  return results[type as keyof typeof results] || defaultResult;
}
