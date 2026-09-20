import { useId } from 'react';
import {
  icarMatrices,
  icarCubes,
  referenceCube,
  type MatrixShape,
  type MatrixCell,
  type MarkedCube,
} from '../content/icar';

const ink = '#202724';

function Shape({ shape }: { shape: MatrixShape }) {
  if (shape === 'circle') return <circle r="28" />;
  if (shape === 'rectangle') return <rect x="-23" y="-31" width="46" height="62" />;
  if (shape === 'square') return <rect x="-28" y="-28" width="56" height="56" />;
  if (shape === 'diamond') return <path d="M0 -35 20 0 0 35 -20 0Z" />;
  if (shape === 'triangle') return <path d="M0 -28 25 22 -25 22Z" />;
  if (shape === 'cross') return <path d="M-10 -30H10V-10H30V10H10V30H-10V10H-30V-10H-10Z" />;
  return <path d="M0 -30 7 -10 29 -9 12 4 18 25 0 12 -18 25 -12 4 -29 -9 -7 -10Z" />;
}

export function IcarMatrixCell({ cell }: { cell: MatrixCell }) {
  const id = useId();
  const side = cell.side ?? 'top';
  const positions = { top: [0, -39], right: [39, 0], bottom: [0, 39], left: [-39, 0] };
  const [mx, my] = positions[side];
  const mainColor = cell.background ? 'white' : ink;
  const innerColor = cell.background ? ink : 'white';
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="Pattern piece">
      <rect width="100" height="100" fill={cell.background ? ink : 'white'} />
      <g transform="translate(50 50)">
        {cell.inner ? (
          <>
            <g fill={mainColor} transform="scale(1.32)">
              <Shape shape={cell.shape} />
            </g>
            <g fill={innerColor} transform="scale(.51)">
              <Shape shape={cell.inner} />
            </g>
          </>
        ) : (
          <>
            <g transform={`rotate(${cell.turn ?? 0})`}>
              <defs>
                <clipPath id={id}>
                  <Shape shape={cell.shape} />
                </clipPath>
              </defs>
              <g fill={cell.fill === 'full' ? ink : 'white'}>
                <Shape shape={cell.shape} />
              </g>
              {cell.fill === 'half' && (
                <g clipPath={`url(#${id})`} fill={ink}>
                  {cell.shape === 'rectangle' ? (
                    <path d="M-23 -31 23 31H-23Z" />
                  ) : (
                    <rect x="-40" y={cell.shape === 'diamond' ? 0 : -40} width="80" height="40" />
                  )}
                </g>
              )}
              <g fill="none" stroke={ink} strokeWidth="1.4" strokeLinejoin="round">
                <Shape shape={cell.shape} />
              </g>
            </g>
            {cell.marker && (
              <g
                transform={`translate(${mx} ${my}) rotate(${cell.marker === 'triangle' ? { top: 0, right: 90, bottom: 180, left: 270 }[side] : 0}) scale(.31)`}
                fill={cell.markerFilled ? ink : 'white'}
                stroke={ink}
                strokeWidth="3.7"
                strokeLinejoin="round"
              >
                {cell.marker === 'diamond' ? (
                  <path d="M0 -27 27 0 0 27 -27 0Z" />
                ) : (
                  <Shape shape={cell.marker} />
                )}
              </g>
            )}
            {cell.arrow !== undefined && (
              <g transform={`rotate(${cell.arrow})`} stroke={ink} fill={ink} strokeWidth="1.4">
                <path d="M0 -28V-41" />
                <path d="M0 -46 -3 -39H3Z" />
              </g>
            )}
          </>
        )}
      </g>
    </svg>
  );
}

export function IcarCube({ cube = referenceCube }: { cube?: MarkedCube }) {
  return (
    <svg viewBox="0 0 100 110" role="img" aria-label="Cube with marked faces">
      <g fill="white" stroke={ink} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M50 8 92 32 50 56 8 32Z" />
        <path d="M8 32 50 56V104L8 80Z" />
        <path d="M50 56 92 32V80L50 104Z" />
      </g>
      {cube.map(([arms, turn], i) => (
        <g
          key={i}
          transform={
            ['matrix(.7 -.4 .7 .4 50 32)', 'matrix(.7 .4 0 .8 29 68)', 'matrix(.7 -.4 0 .8 71 68)'][
              i
            ]
          }
        >
          <g transform={`rotate(${turn})`} stroke={ink} fill={ink}>
            {arms === 0 ? (
              <circle r="13" strokeWidth="5" fill="none" />
            ) : (
              Array.from({ length: arms }, (_, n) => (
                <g key={n} transform={`rotate(${(n * 360) / arms})`}>
                  <path d="M0 0V-14" strokeWidth="5" strokeLinecap="round" />
                  <circle cy="-14" r="4" stroke="none" />
                </g>
              ))
            )}
          </g>
        </g>
      ))}
    </svg>
  );
}

export function IcarStimulus({ id }: { id: string }) {
  const matrix = icarMatrices[id];
  if (!matrix)
    return (
      <div className="icar-cube-reference">
        <IcarCube />
        <span>X</span>
      </div>
    );
  const missing = id === 'MR.47' ? 5 : 8;
  return (
    <div className="icar-matrix">
      {Array.from({ length: 9 }, (_, i) =>
        i === missing ? (
          <div key={i} className="missing-cell" aria-label="Missing piece">
            ?
          </div>
        ) : (
          <IcarMatrixCell key={i} cell={matrix.cells[i > missing ? i - 1 : i]} />
        ),
      )}
    </div>
  );
}

export function IcarOption({ id, index }: { id: string; index: number }) {
  const matrix = icarMatrices[id];
  if (matrix) return <IcarMatrixCell cell={matrix.choices[index]} />;
  const cube = icarCubes[id][index];
  return cube ? (
    <IcarCube cube={cube} />
  ) : (
    <span className="cube-text-option">
      {index === 3 ? 'None of the cubes could be a rotation.' : 'I do not know the solution.'}
    </span>
  );
}
