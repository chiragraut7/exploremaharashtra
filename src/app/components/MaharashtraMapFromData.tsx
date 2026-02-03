// components/MaharashtraAutoDots.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type PlaceJson = {
  slug?: string;
  name?: string;
  overview?: { shortDescription?: string } | string;
  title?: string;
  gallery?: string[];
  [k: string]: any;
};

type Placed = {
  id: string;       // "00".."21"
  name: string;
  href?: string;
  type: "Beach";
  xPercent: number;
  yPercent: number;
  data?: PlaceJson;
};

const FILE_IDS = [
  "00","01","02","03","04","05","06","07","08","09",
  "10","11","12","13","14","15","16","17","18","19","20","21"
];

// Approximate positions (xPercent, yPercent) — automatically placed, tweak as needed
const APPROX_COORDS: Record<string, { x: number; y: number }> = {
  "00": { x: 20, y: 78 }, // Malvan
  "01": { x: 56, y: 45 }, // Alibaug
  "02": { x: 18, y: 30 }, // Kelwa
  "03": { x: 60, y: 48 }, // Kashid
  "04": { x: 62, y: 54 }, // Murud
  "05": { x: 60, y: 38 }, // Nagaon
  "06": { x: 12, y: 18 }, // Arnala
  "07": { x: 6,  y: 26 }, // Bordi
  "08": { x: 8,  y: 22 }, // Dahanu
  "09": { x: 30, y: 70 }, // Ganpatipule
  "10": { x: 16, y: 86 }, // Tarkarli
  "11": { x: 48, y: 66 }, // Diveagar
  "12": { x: 50, y: 62 }, // Harihareshwar
  "13": { x: 52, y: 64 }, // Shrivardhan
  "14": { x: 14, y: 72 }, // Velas
  "15": { x: 24, y: 74 }, // Guhagar
  "16": { x: 24, y: 76 }, // Shiroda
  "17": { x: 6,  y: 90 }, // Vengurla
  "18": { x: 10, y: 84 }, // Aare Ware
  "19": { x: 22, y: 80 }, // Velneshwar
  "20": { x: 28, y: 82 }, // Kelshi
  "21": { x: 28, y: 78 }, // Anjarle
};

export default function MaharashtraAutoDots({
  svgUrl = "/assets/images/maharashtra-state-of-india.svg",
  width = "100%",
  height = 720,
  dotRadius = 6,         // displayed marker radius (px)
  hoverScale = 1.9,      // scale factor on hover
}: {
  svgUrl?: string;
  width?: string | number;
  height?: number | string;
  dotRadius?: number;
  hoverScale?: number;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [places, setPlaces] = useState<Placed[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; left: number; top: number; place?: Placed | null }>({
    visible: false,
    left: 0,
    top: 0,
    place: null,
  });

  // Load all beach JSONs and build places
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded: Placed[] = [];
      for (const id of FILE_IDS) {
        try {
          const res = await fetch(`/data/beaches/${id}.json`);
          const json: PlaceJson = await res.json();
          const name =
            json.name || json.title || (Array.isArray(json.title) ? json.title[0] : undefined) || `Beach ${id}`;
          const slug = (json.slug as string) || undefined;
          const href = slug ? `/beaches/${slug}` : `/beaches/${id}`;
          const coords = APPROX_COORDS[id] ?? { x: 40, y: 50 };
          loaded.push({
            id,
            name,
            href,
            type: "Beach",
            xPercent: coords.x,
            yPercent: coords.y,
            data: json,
          });
        } catch (err) {
          // If file missing, still push placeholder so map remains consistent
          const coords = APPROX_COORDS[id] ?? { x: 40, y: 50 };
          loaded.push({
            id,
            name: `Beach ${id}`,
            href: `/beaches/${id}`,
            type: "Beach",
            xPercent: coords.x,
            yPercent: coords.y,
            data: undefined,
          });
        }
        if (cancelled) return;
      }
      if (!cancelled) setPlaces(loaded);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Tooltip helper
  function showTooltipFor(e: React.MouseEvent, place: Placed) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const left = (place.xPercent / 100) * rect.width + 12;
    const top = (place.yPercent / 100) * rect.height;
    setTooltip({ visible: true, left, top, place });
    setHoveredId(place.id);
  }
  function hideTooltip() {
    setTooltip({ visible: false, left: 0, top: 0, place: null });
    setHoveredId(null);
  }

  return (
    <div style={{ width }} ref={containerRef}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>Explore Maharashtra</div>
        <div style={{ color: "#6b7280" }}>Hover a dot to zoom it — click More to open details</div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: typeof height === "number" ? `${height}px` : height,
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid rgba(2,6,23,0.06)",
        }}
      >
        {/* Background SVG image (keeps decorative dots inside) */}
        <img
          src={svgUrl}
          alt="Maharashtra dotted map"
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", userSelect: "none", pointerEvents: "none" }}
          draggable={false}
        />

        {/* Interactive markers (absolute positioned using percentages) */}
        {places.map((p) => {
          const left = `${p.xPercent}%`;
          const top = `${p.yPercent}%`;
          const isHovered = hoveredId === p.id;
          return (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onMouseEnter={(e) => showTooltipFor(e, p)}
              onMouseMove={(e) => showTooltipFor(e, p)}
              onMouseLeave={() => hideTooltip()}
              onClick={() => {
                if (p.href) router.push(p.href);
              }}
              style={{
                position: "absolute",
                left,
                top,
                transform: "translate(-50%, -50%)",
                pointerEvents: "auto",
                zIndex: isHovered ? 40 : 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 150ms ease, box-shadow 150ms",
              }}
            >
              {/* marker circle */}
              <div
                style={{
                  width: dotRadius * 2,
                  height: dotRadius * 2,
                  borderRadius: 999,
                  background: "#f97316",
                  boxShadow: isHovered ? "0 10px 28px rgba(249,115,22,0.28)" : "0 2px 8px rgba(2,6,23,0.12)",
                  transform: isHovered ? `scale(${hoverScale})` : "scale(1)",
                  transition: "transform 160ms ease, box-shadow 160ms",
                  border: "2px solid rgba(2,6,23,0.9)",
                  cursor: p.href ? "pointer" : "default",
                }}
              />
            </div>
          );
        })}

        {/* Tooltip card */}
        {tooltip.visible && tooltip.place && (
          <div
            style={{
              position: "absolute",
              left: tooltip.left,
              top: tooltip.top,
              transform: "translateY(-50%)",
              zIndex: 80,
              minWidth: 220,
              maxWidth: 340,
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg, rgba(2,6,23,0.95), rgba(4,8,17,0.95))",
                border: "1px solid rgba(249,115,22,0.12)",
                color: "#e6eef8",
                padding: 12,
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                fontSize: 13,
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: "#f97316" }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{tooltip.place.name}</div>
                  <div style={{ fontSize: 11, color: "#f6ad55", marginTop: 2 }}>{tooltip.place.type}</div>
                </div>
              </div>

              {/* short description */}
              <div style={{ marginTop: 8, color: "#cfe8ff", fontSize: 12, lineHeight: 1.2 }}>
                {typeof tooltip.place.data?.overview === "string"
                  ? tooltip.place.data?.overview
                  : tooltip.place.data?.overview?.shortDescription ?? ""}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    if (tooltip.place?.href) router.push(tooltip.place.href);
                  }}
                  style={{
                    background: "#f97316",
                    border: "none",
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontWeight: 800,
                    cursor: tooltip.place?.href ? "pointer" : "not-allowed",
                    color: "#071022",
                  }}
                >
                  More
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
