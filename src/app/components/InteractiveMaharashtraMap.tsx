// components/InteractiveMaharashtraMap.tsx
import { useEffect, useRef, useState, MouseEvent } from "react";

type Place = {
  id: string;
  name: string;
  type: string;
  description: string;
  xPercent: number; // 0–100 within the Maharashtra shape
  yPercent: number; // 0–100 within the Maharashtra shape
};

interface Props {
  width?: number;
  height?: number;
  mapImageSrc: string; // /assets/images/image.png
  backgroundDotRadius?: number;
  backgroundDotGap?: number;
  backgroundDotColor?: string;
  markerRadius?: number;
  markerColor?: string;
  hoverScale?: number;
  places?: Place[];
}

export default function InteractiveMaharashtraMap({
  width = 600,
  height = 520,
  mapImageSrc,
  backgroundDotRadius = 1.6,
  backgroundDotGap = 7,
  backgroundDotColor = "#334155", // slate-ish
  markerRadius = 4,
  markerColor = "#f97316", // orange-500
  hoverScale = 1.8,
  places = [
    {
      id: "kelwa",
      name: "Kelwa Beach",
      type: "Beach",
      description: "Serene beach near Palghar, perfect for a quiet weekend.",
      xPercent: 12,
      yPercent: 35,
    },
    {
      id: "tarkarli",
      name: "Tarkarli Beach",
      type: "Beach",
      description: "Famous for scuba diving and crystal-clear waters.",
      xPercent: 15,
      yPercent: 78,
    },
    {
      id: "bordi",
      name: "Bordi Beach",
      type: "Beach",
      description: "Calm shoreline with chikoo orchards nearby.",
      xPercent: 5,
      yPercent: 30,
    },
    {
      id: "mahabaleshwar",
      name: "Mahabaleshwar",
      type: "Hill Station",
      description: "Strawberries, viewpoints and evergreen forests.",
      xPercent: 40,
      yPercent: 50,
    },
  ],
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const baseLayerRef = useRef<ImageData | null>(null);
  const layoutRef = useRef<{
    offsetX: number;
    offsetY: number;
    drawWidth: number;
    drawHeight: number;
  } | null>(null);

  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    place: Place | null;
  } | null>(null);

  // Draw dotted silhouette once (background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = mapImageSrc;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      // Fit silhouette into canvas
      const scale = Math.min(width / img.width, height / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      // Draw silhouette to fetch pixel data
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Clear and draw background dots where silhouette is non-transparent
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = backgroundDotColor;

      for (let y = 0; y < height; y += backgroundDotGap) {
        for (let x = 0; x < width; x += backgroundDotGap) {
          const i = (y * width + x) * 4;
          const alpha = data[i + 3];
          if (alpha > 10) {
            ctx.beginPath();
            ctx.arc(x, y, backgroundDotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Save dotted base layer
      baseLayerRef.current = ctx.getImageData(0, 0, width, height);
      layoutRef.current = { offsetX, offsetY, drawWidth, drawHeight };

      // Draw markers first time
      drawMarkers(ctx, places, hoveredPlaceId, {
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      });
    };
  }, [
    mapImageSrc,
    width,
    height,
    backgroundDotRadius,
    backgroundDotGap,
    backgroundDotColor,
    places,
  ]);

  // Redraw markers when hover changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!baseLayerRef.current || !layoutRef.current) return;

    ctx.putImageData(baseLayerRef.current, 0, 0);
    drawMarkers(ctx, places, hoveredPlaceId, layoutRef.current, {
      markerRadius,
      markerColor,
      hoverScale,
    });
  }, [hoveredPlaceId, places, markerRadius, markerColor, hoverScale]);

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const layout = layoutRef.current;
    if (!layout) return;

    const found = findPlaceAtPosition(
      offsetX,
      offsetY,
      places,
      layout,
      markerRadius,
      hoverScale
    );

    if (found) {
      setHoveredPlaceId(found.place.id);
      setTooltip({
        x: offsetX + 14,
        y: offsetY - 10,
        place: found.place,
      });
    } else {
      setHoveredPlaceId(null);
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPlaceId(null);
    setTooltip(null);
  };

  return (
    <div className="relative inline-block rounded-3xl bg-slate-900/80 p-4 shadow-2xl border border-slate-700/60">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="rounded-2xl border border-slate-700/70 shadow-inner"
        style={{
          width,
          height,
          display: "block",
        }}
      />

      {tooltip && tooltip.place && (
        <div
          className="pointer-events-none absolute z-20 max-w-[220px] -translate-y-1 rounded-2xl border border-orange-400/60 bg-slate-900/95 px-3 py-2 text-xs text-slate-50 shadow-xl backdrop-blur"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/90 text-[10px] font-bold">
              ●
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-orange-300">
                {tooltip.place.type}
              </div>
              <div className="text-sm font-semibold">{tooltip.place.name}</div>
            </div>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-slate-200/90">
            {tooltip.place.description}
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span>Region fill</span>
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          <span>Tourist spots</span>
        </div>
        <span className="text-slate-400/80">Hover dots to explore</span>
      </div>
    </div>
  );

  // Helper: draw markers
  function drawMarkers(
    ctx: CanvasRenderingContext2D,
    placesToDraw: Place[],
    hoveredId: string | null,
    layout: { offsetX: number; offsetY: number; drawWidth: number; drawHeight: number },
    opts?: { markerRadius?: number; markerColor?: string; hoverScale?: number }
  ) {
    const r = opts?.markerRadius ?? markerRadius;
    const color = opts?.markerColor ?? markerColor;
    const scale = opts?.hoverScale ?? hoverScale;

    ctx.save();
    ctx.lineWidth = 1.2;

    for (const place of placesToDraw) {
      const { x, y } = placeToCanvas(place, layout);
      const isHovered = place.id === hoveredId;
      const radius = isHovered ? r * scale : r;

      // glow
      if (isHovered) {
        const gradient = ctx.createRadialGradient(
          x,
          y,
          radius * 0.2,
          x,
          y,
          radius * 3
        );
        gradient.addColorStop(0, "rgba(249,115,22,0.5)");
        gradient.addColorStop(1, "rgba(249,115,22,0.0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // main dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // border
      ctx.strokeStyle = "rgba(15,23,42,0.9)";
      ctx.beginPath();
      ctx.arc(x, y, radius + 0.8, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Helper: normalized place -> canvas coordinates
  function placeToCanvas(
    place: Place,
    layout: { offsetX: number; offsetY: number; drawWidth: number; drawHeight: number }
  ) {
    const x = layout.offsetX + (place.xPercent / 100) * layout.drawWidth;
    const y = layout.offsetY + (place.yPercent / 100) * layout.drawHeight;
    return { x, y };
  }

  // Helper: hit-test to find hovered place
  function findPlaceAtPosition(
    px: number,
    py: number,
    allPlaces: Place[],
    layout: { offsetX: number; offsetY: number; drawWidth: number; drawHeight: number },
    r: number,
    scale: number
  ): { place: Place } | null {
    const maxR = r * scale * 1.2;

    for (const place of allPlaces) {
      const { x, y } = placeToCanvas(place, layout);
      const dx = px - x;
      const dy = py - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= maxR) {
        return { place };
      }
    }
    return null;
  }
}
