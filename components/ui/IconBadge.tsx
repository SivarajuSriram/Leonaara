import type { ComponentType, SVGProps } from 'react';

// Recreates the visual language of the original eriro icon SVGs
// (public/images/Icons/EN-icons_EN_*.svg): the label curves along an open
// circular stroke, with a glyph centered inside. Those originals are
// bespoke illustrations (a drawn bed, record player, etc.) which can't be
// generated here -- this uses a lucide-react icon in the center instead,
// but keeps the same circular curved-label treatment so new concepts
// ("Concierge Service" etc., which have no matching illustration) still
// read as the same icon style rather than a plain generic icon.
type Props = { id: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const CX = 60;
const CY = 60;
const R = 48;
const FONT_SIZE = 10.5;
// A fixed semicircle split left a gap between where short labels ("Concierge
// Service") actually ended and where the stroke picked up, and cramped long
// ones ("Fully Serviced Estates") -- sizing the arc to each label's own
// length means the text and the closing stroke always meet exactly where
// the text ends, whatever the label.
const DEG_PER_CHAR = 7; // tuned for this font/size/radius combo
const MARGIN = 1.15; // headroom so glyphs don't touch the arc's own ends
const MIN_SPAN = 90; // floor: very short labels still read as a proper arc
const MAX_SPAN = 300; // ceiling: text never eats almost the whole circle
const END_ANGLE = 350; // fixed terminus on the upper-right diagonal

function polarToXY(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

export function IconBadge({ id, label, icon: Icon }: Props) {
  const pathId = `icon-badge-arc-${id}`;
  const span = Math.min(MAX_SPAN, Math.max(MIN_SPAN, label.length * DEG_PER_CHAR * MARGIN));
  const startAngle = END_ANGLE - span;
  const start = polarToXY(startAngle);
  const end = polarToXY(END_ANGLE);
  const textLargeArc = span > 180 ? 1 : 0;
  const strokeLargeArc = 360 - span > 180 ? 1 : 0;
  const textPathD = `M ${start.x} ${start.y} A ${R} ${R} 0 ${textLargeArc} 1 ${end.x} ${end.y}`;
  const strokePathD = `M ${end.x} ${end.y} A ${R} ${R} 0 ${strokeLargeArc} 1 ${start.x} ${start.y}`;

  return (
    <div className="relative h-[13rem] w-[13rem] max-lg:h-[9rem] max-lg:w-[9rem]">
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
        <path id={pathId} d={textPathD} fill="none" />
        <path d={strokePathD} fill="none" stroke="#211d1d" strokeWidth="1" />
        <text fill="#211d1d" fontSize={FONT_SIZE} letterSpacing="0.1" style={{ fontFamily: 'var(--font-sans)' }}>
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {label.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <Icon
        className="absolute top-1/2 left-1/2 h-[4rem] w-[4rem] -translate-x-1/2 -translate-y-1/2 text-ink max-lg:h-[2.8rem] max-lg:w-[2.8rem]"
        strokeWidth={1}
      />
    </div>
  );
}
