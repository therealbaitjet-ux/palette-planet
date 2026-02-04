"use client";

import { useEffect } from "react";

interface AdUnitProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdUnit({ slot, style, className }: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{
        display: "block",
        ...style,
      }}
      data-ad-client="ca-pub-5666528673778539"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
