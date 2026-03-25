"use client";

import { useEffect, useRef } from "react";

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let animFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Wire colors
    const colors = ["#56e6e1", "#ff4400", "#1a1a1a", "#ff4400"];

    // Generate a fixed grid of wire segments
    const CELL = 80;
    type Segment = {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
    };
    type Node = { x: number; y: number; color: string };
    type Pulse = { seg: Segment; t: number; speed: number; color: string };

    const segments: Segment[] = [];
    const nodes: Node[] = [];

    const cols = Math.ceil(window.innerWidth / CELL) + 2;
    const rows = Math.ceil(window.innerHeight / CELL) + 2;

    // Build an L-shaped manhattan grid of wires
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.45) continue;
        const x = c * CELL;
        const y = r * CELL;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dir = Math.random() > 0.5;

        if (dir) {
          // Horizontal then vertical (L-shape)
          const len = (Math.floor(Math.random() * 3) + 1) * CELL;
          const turn =
            (Math.floor(Math.random() * 2) + 1) *
            CELL *
            (Math.random() > 0.5 ? 1 : -1);
          segments.push({ x1: x, y1: y, x2: x + len, y2: y, color });
          segments.push({
            x1: x + len,
            y1: y,
            x2: x + len,
            y2: y + turn,
            color,
          });
          nodes.push({ x: x + len, y, color });
        } else {
          // Vertical then horizontal
          const len = (Math.floor(Math.random() * 3) + 1) * CELL;
          const turn =
            (Math.floor(Math.random() * 2) + 1) *
            CELL *
            (Math.random() > 0.5 ? 1 : -1);
          segments.push({ x1: x, y1: y, x2: x, y2: y + len, color });
          segments.push({
            x1: x,
            y1: y + len,
            x2: x + turn,
            y2: y + len,
            color,
          });
          nodes.push({ x, y: y + len, color });
        }
      }
    }

    // Pulses travelling along segments
    const pulses: Pulse[] = [];
    segments.forEach((seg) => {
      if (Math.random() > 0.3) return;
      pulses.push({
        seg,
        t: Math.random(),
        speed: 0.001 + Math.random() * 0.002,
        color: seg.color,
      });
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw wires
      segments.forEach(({ x1, y1, x2, y2, color }) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.13;
        ctx.stroke();
      });

      // Draw solder joints
      nodes.forEach(({ x, y, color }) => {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.18;
        ctx.fill();
      });

      // Draw pulses
      pulses.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;

        const { x1, y1, x2, y2 } = p.seg;
        const px = x1 + (x2 - x1) * p.t;
        const py = y1 + (y2 - y1) * p.t;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.35;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ filter: "blur(0.8px)" }}
      />
      <div className="absolute inset-0 bg-white/72" />
    </div>
  );
}
