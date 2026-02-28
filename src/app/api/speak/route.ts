import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel voice as default

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // If no API key, return error (client will use browser TTS fallback)
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API not configured" },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("ElevenLabs API error:", await response.text());
      return NextResponse.json(
        { error: "Failed to generate speech" },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Speak API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
