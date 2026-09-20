import { useId } from 'react';
import type { ChoiceItem, Glyph, Point2, Point3 } from '../domain';
import { IcarStimulus, IcarOption } from './IcarStimulus';

export function GlyphDrawing({ glyph }: { glyph: Glyph }) {
  const title = useId();
  if (glyph.mask !== undefined)
    return (
      <svg viewBox="0 0 100 100" role="img" aria-labelledby={title}>
        <title id={title}>Dot pattern</title>
        {Array.from({ length: 9 }, (_, i) => (
          <circle
            key={i}
            cx={27 + (i % 3) * 23}
            cy={27 + Math.floor(i / 3) * 23}
            r={5.5}
            fill={glyph.mask! & (1 << i) ? '#202724' : 'none'}
            stroke="#202724"
            strokeWidth="1.5"
          />
        ))}
      </svg>
    );
  const positions =
    glyph.count === 1
      ? [[50, 50]]
      : glyph.count === 2
        ? [
            [29, 50],
            [71, 50],
          ]
        : glyph.count === 3
          ? [
              [50, 26],
              [28, 70],
              [72, 70],
            ]
          : glyph.count === 4
            ? [
                [28, 28],
                [72, 28],
                [28, 72],
                [72, 72],
              ]
            : [
                [24, 24],
                [76, 24],
                [50, 50],
                [24, 76],
                [76, 76],
              ];
  const size = glyph.count === 1 ? 25 : glyph.count < 5 ? 14 : 12;
  return (
    <svg viewBox="0 0 100 100" role="img" aria-labelledby={title}>
      <title id={title}>Symbol pattern</title>
      {positions.map(([x, y], i) => (
        <g
          key={i}
          transform={`translate(${x} ${y})`}
          fill={glyph.fill ? '#202724' : 'white'}
          stroke="#202724"
          strokeWidth="2.2"
          strokeLinejoin="round"
        >
          {glyph.shape === 'circle' ? (
            <circle r={size} />
          ) : glyph.shape === 'square' ? (
            <rect x={-size} y={-size} width={size * 2} height={size * 2} />
          ) : glyph.shape === 'triangle' ? (
            <path d={`M0 ${-size} L${size} ${size} L${-size} ${size} Z`} />
          ) : glyph.shape === 'diamond' ? (
            <path d={`M0 ${-size * 1.2} L${size} 0 L0 ${size * 1.2} L${-size} 0 Z`} />
          ) : (
            <path
              d={`M${-size / 3} ${-size} H${size / 3} V${-size / 3} H${size} V${size / 3} H${size / 3} V${size} H${-size / 3} V${size / 3} H${-size} V${-size / 3} H${-size / 3} Z`}
            />
          )}
          {glyph.mark && (
            <circle
              cx={Math.sin((glyph.turn * Math.PI) / 180) * size * 0.65}
              cy={-Math.cos((glyph.turn * Math.PI) / 180) * size * 0.65}
              r={3.4}
              fill={glyph.fill ? 'white' : '#202724'}
              stroke="none"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

export function CubeDrawing({ points }: { points: Point3[] }) {
  const title = useId();
  const scale = 20;
  const project = ([x, y, z]: Point3) => [(x - y) * scale, ((x + y) * scale) / 2 - z * scale];
  const projected = points.map(project);
  const minX = Math.min(...projected.map((p) => p[0])) - scale - 5;
  const maxX = Math.max(...projected.map((p) => p[0])) + scale + 5;
  const minY = Math.min(...projected.map((p) => p[1])) - scale - 5;
  const maxY = Math.max(...projected.map((p) => p[1])) + scale + 5;
  const set = new Set(points.map((p) => p.join(',')));
  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      role="img"
      aria-labelledby={title}
    >
      <title id={title}>Connected block object</title>
      {[...points]
        .sort((a, b) => a[0] + a[1] + a[2] - b[0] - b[1] - b[2])
        .map((p) => {
          const [x, y] = project(p);
          return (
            <g
              key={p.join(',')}
              transform={`translate(${x} ${y})`}
              stroke="#26332c"
              strokeWidth=".85"
              strokeLinejoin="round"
            >
              {!set.has([p[0], p[1] + 1, p[2]].join(',')) && (
                <path d="M-20 -10 L0 0 L0 20 L-20 10 Z" fill="#d1d8d3" />
              )}
              {!set.has([p[0] + 1, p[1], p[2]].join(',')) && (
                <path d="M0 0 L20 -10 L20 10 L0 20 Z" fill="#aab8af" />
              )}
              {!set.has([p[0], p[1], p[2] + 1].join(',')) && (
                <path d="M0 -20 L20 -10 L0 0 L-20 -10 Z" fill="#f4f6f3" />
              )}
            </g>
          );
        })}
    </svg>
  );
}

export function PaperDrawing({
  holes,
  width = 8,
  height = 8,
}: {
  holes: Point2[];
  width?: number;
  height?: number;
}) {
  const title = useId();
  return (
    <svg viewBox="-1 -1 10 10" role="img" aria-labelledby={title}>
      <title id={title}>Paper and hole positions</title>
      <rect
        width={8}
        height={8}
        fill="none"
        stroke="#c8cec9"
        strokeWidth=".07"
        strokeDasharray=".2 .2"
      />
      <rect width={width} height={height} fill="white" stroke="#26332c" strokeWidth=".11" />
      {holes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.17} fill="#202724" />
      ))}
    </svg>
  );
}

export function FoldSequence({ item }: { item: Extract<ChoiceItem, { kind: 'folding' }> }) {
  let width = 8,
    height = 8;
  return (
    <div className="fold-sequence">
      {item.folds.map((fold, i) => {
        const w = width,
          h = height;
        if (fold === 'left') width /= 2;
        else height /= 2;
        return (
          <div className="fold-step" key={i}>
            <svg
              viewBox="-1 -1 10 10"
              role="img"
              aria-label={`Fold ${i + 1}: ${fold === 'left' ? 'right half to the left' : 'bottom half upwards'}`}
            >
              <rect
                width={8}
                height={8}
                fill="none"
                stroke="#d4d9d4"
                strokeWidth=".07"
                strokeDasharray=".2 .2"
              />
              <rect width={w} height={h} fill="#eef1ed" stroke="#26332c" strokeWidth=".1" />
              {fold === 'left' ? (
                <>
                  <path
                    d={`M${w / 2} 0 V${h}`}
                    stroke="#26332c"
                    strokeWidth=".1"
                    strokeDasharray=".3 .2"
                  />
                  <path
                    d={`M${w * 0.8} ${h * 0.45} Q${w * 0.5} ${h * 0.12} ${w * 0.2} ${h * 0.45} l.7 -.06 m-.7 .06 l.14 -.7`}
                    fill="none"
                    stroke="#26332c"
                    strokeWidth=".12"
                  />
                </>
              ) : (
                <>
                  <path
                    d={`M0 ${h / 2} H${w}`}
                    stroke="#26332c"
                    strokeWidth=".1"
                    strokeDasharray=".3 .2"
                  />
                  <path
                    d={`M${w * 0.45} ${h * 0.8} Q${w * 0.12} ${h * 0.5} ${w * 0.45} ${h * 0.2} l-.06 .7 m.06 -.7 l-.7 .14`}
                    fill="none"
                    stroke="#26332c"
                    strokeWidth=".12"
                  />
                </>
              )}
            </svg>
            <span>Fold {i + 1}</span>
          </div>
        );
      })}
      <div className="fold-step">
        <PaperDrawing holes={item.holes} width={width} height={height} />
        <span>Punch</span>
      </div>
    </div>
  );
}

export function ItemStimulus({ item }: { item: ChoiceItem }) {
  if (item.kind === 'icar-matrix' || item.kind === 'icar-cube')
    return <IcarStimulus id={item.id} />;
  if (item.kind === 'matrix')
    return (
      <div className="matrix-grid">
        {item.cells.map((g, i) => (
          <div key={i}>
            <GlyphDrawing glyph={g} />
          </div>
        ))}
        <div className="missing-cell" aria-label="Missing piece">
          ?
        </div>
      </div>
    );
  if (item.kind === 'rotation')
    return (
      <div className="rotation-reference">
        <CubeDrawing points={item.object} />
      </div>
    );
  if (item.kind === 'folding') return <FoldSequence item={item} />;
  if (item.kind !== 'text') return null;
  if (item.id.startsWith('VR.') || item.id.startsWith('LN.')) return null;
  if (item.sequence)
    return (
      <div
        className="number-sequence"
        aria-label={`Sequence: ${item.sequence.join(', ')}, question mark`}
      >
        {item.sequence.map((n, i) => (
          <span key={i}>{n}</span>
        ))}
        <span className="missing-number">?</span>
      </div>
    );
  return (
    <div className={`word-stimulus ${item.id.includes('analog') ? 'analogy' : ''}`}>
      {item.prompt}
    </div>
  );
}

export function OptionStimulus({ item, index }: { item: ChoiceItem; index: number }) {
  if (item.kind === 'icar-matrix' || item.kind === 'icar-cube')
    return <IcarOption id={item.id} index={index} />;
  if (item.kind === 'matrix') return <GlyphDrawing glyph={item.choices[index]} />;
  if (item.kind === 'rotation') return <CubeDrawing points={item.choices[index]} />;
  if (item.kind === 'folding') return <PaperDrawing holes={item.choices[index]} />;
  return <span>{item.options[index]}</span>;
}
