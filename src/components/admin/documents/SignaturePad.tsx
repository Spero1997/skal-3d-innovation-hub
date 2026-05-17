import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';

type Props = {
  onChange: (dataUrl: string | null) => void;
  height?: number;
};

export function SignaturePad({ onChange, height = 160 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr; c.height = rect.height * dpr;
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#ffffff';
  }, []);

  const pos = (e: any) => {
    const c = ref.current!; const r = c.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  };
  const start = (e: any) => { setDrawing(true); const ctx = ref.current!.getContext('2d')!; const { x, y } = pos(e); ctx.beginPath(); ctx.moveTo(x, y); };
  const move = (e: any) => { if (!drawing) return; const ctx = ref.current!.getContext('2d')!; const { x, y } = pos(e); ctx.lineTo(x, y); ctx.stroke(); setEmpty(false); };
  const end = () => { setDrawing(false); if (!empty) onChange(ref.current!.toDataURL('image/png')); };
  const clear = () => { const c = ref.current!; const ctx = c.getContext('2d')!; ctx.clearRect(0, 0, c.width, c.height); setEmpty(true); onChange(null); };

  return (
    <div>
      <canvas
        ref={ref}
        style={{ height, width: '100%' }}
        className="rounded border border-white/10 bg-black/40 touch-none"
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      />
      <div className="flex justify-end mt-2">
        <Button type="button" size="sm" variant="ghost" onClick={clear} className="text-white/60">
          <Eraser className="w-3 h-3 mr-1" /> Effacer
        </Button>
      </div>
    </div>
  );
}