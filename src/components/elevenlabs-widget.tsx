"use client";

import { useEffect, useRef } from "react";

export function ElevenLabsWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      script.onload = () => {
        if (widgetRef.current && !widgetRef.current.querySelector("elevenlabs-convai")) {
          const widget = document.createElement("elevenlabs-convai");
          widget.setAttribute("agent-id", "agent_4601kjhje033essagvc1z0fdmfsf");
          widgetRef.current.appendChild(widget);
        }
      };
      document.body.appendChild(script);
    } else {
      if (widgetRef.current && !widgetRef.current.querySelector("elevenlabs-convai")) {
        const widget = document.createElement("elevenlabs-convai");
        widget.setAttribute("agent-id", "agent_4601kjhje033essagvc1z0fdmfsf");
        widgetRef.current.appendChild(widget);
      }
    }
  }, []);

  return <div ref={widgetRef} className="fixed bottom-6 right-6 z-50" />;
}
