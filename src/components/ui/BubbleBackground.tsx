const BLOBS = [
  { size: 300, x: 15, y: 20, color: 'rgba(0, 184, 195, 0.12)', dur: 20, delay: 0 },
  { size: 400, x: 70, y: 15, color: 'rgba(246, 130, 196, 0.10)', dur: 25, delay: 2 },
  { size: 350, x: 40, y: 60, color: 'rgba(203, 108, 235, 0.08)', dur: 22, delay: 4 },
  { size: 280, x: 80, y: 70, color: 'rgba(249, 115, 22, 0.06)', dur: 18, delay: 1 },
  { size: 320, x: 20, y: 80, color: 'rgba(45, 212, 191, 0.08)', dur: 24, delay: 3 },
]

export function BubbleBackground() {
  return (
    <>
      <style>{`
        @keyframes blob-drift {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); }
          33% { transform: translate(-50%, -50%) translate(30px, -25px) scale(1.08); }
          66% { transform: translate(-50%, -50%) translate(-20px, 15px) scale(0.95); }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {BLOBS.map((blob, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: blob.size,
              height: blob.size,
              left: blob.x + '%',
              top: blob.y + '%',
              background: 'radial-gradient(circle, ' + blob.color + ' 0%, transparent 60%)',
              animation: 'blob-drift ' + blob.dur + 's ease-in-out ' + blob.delay + 's infinite',
              willChange: 'transform',
            }}
          />
        ))}
      </div>
    </>
  )
}
