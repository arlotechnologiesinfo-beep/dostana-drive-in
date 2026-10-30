/** Decorative QR-style graphic. It is not scannable; each table has its own printed QR code. */
const SIZE = 21
const FINDER = [
  [0, 0],
  [SIZE - 7, 0],
  [0, SIZE - 7],
]

function isFinder(x: number, y: number): boolean {
  return FINDER.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7)
}

function finderFilled(x: number, y: number): boolean {
  for (const [fx, fy] of FINDER) {
    if (x >= fx && x < fx + 7 && y >= fy && y < fy + 7) {
      const dx = x - fx
      const dy = y - fy
      const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6
      const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
      return ring || core
    }
  }
  return false
}

const CELLS: { x: number; y: number }[] = []
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const on = isFinder(x, y) ? finderFilled(x, y) : ((x * 7 + y * 13 + x * y) % 5 < 2)
    if (on) CELLS.push({ x, y })
  }
}

export function QrIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`} className={className} role="img" aria-label="Sample QR code graphic">
      <rect x={-1} y={-1} width={SIZE + 2} height={SIZE + 2} rx={1.5} fill="#FFFFFF" />
      {CELLS.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#26160F" />
      ))}
    </svg>
  )
}
