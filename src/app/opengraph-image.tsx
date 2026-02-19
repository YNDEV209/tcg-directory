import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'TCG Directory'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 800, color: '#ffffff', letterSpacing: -2 }}>
          TCG Directory
        </div>
        <div style={{ fontSize: 32, color: '#94a3b8', fontWeight: 400 }}>
          Browse Pokemon · MTG · One Piece cards
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          {['Pokemon', 'MTG', 'One Piece'].map((game) => (
            <div
              key={game}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {game}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
