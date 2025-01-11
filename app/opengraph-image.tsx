import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'AI or Human? - A Text-Guessing Game'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a1a',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <h1
          style={{
            fontSize: '60px',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          AI or Human?
        </h1>
        <p
          style={{
            fontSize: '30px',
            textAlign: 'center',
            color: '#cccccc',
          }}
        >
          Test your ability to spot AI-generated content
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
} 