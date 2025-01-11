import { ImageResponse } from 'next/server'

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
          background: 'linear-gradient(to bottom, #ffffff, #f3f4f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#1a56db',
              textAlign: 'center',
              margin: '0',
            }}
          >
            AI or Human?
          </h1>
          <p
            style={{
              fontSize: '40px',
              color: '#4b5563',
              textAlign: 'center',
              margin: '0',
              maxWidth: '800px',
            }}
          >
            Test your skills at detecting AI-generated text!
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                background: '#1a56db',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '9999px',
                fontSize: '32px',
              }}
            >
              Daily Challenge
            </div>
            <div
              style={{
                background: '#059669',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '9999px',
                fontSize: '32px',
              }}
            >
              Practice Mode
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 