import { useState, useRef } from 'react'
import { Mic, Disc, AlertCircle, Search } from 'lucide-react'
import './App.css'

export default function App() {
  const [isListening, setIsListening] = useState(false)
  const [status, setStatus] = useState('Click to Identify')
  const [match, setMatch] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const attemptsRef = useRef(0)

  const startIdentification = async () => {
    try {
      setMatch(null)
      attemptsRef.current = 0
      // Capture audio from the current tab
      chrome.tabCapture.capture({ audio: true }, (stream) => {
        if (!stream) {
          setStatus('Capture failed')
          return
        }

        streamRef.current = stream
        setIsListening(true)
        setStatus('Listening')

        // Keep audio playing for the user
        const audio = new Audio()
        audio.srcObject = stream
        audio.play()

        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            await sendAudioToServer(event.data)
          }
        }

        // Collect chunks every 5 seconds
        mediaRecorder.start(5000)
      })
    } catch (err) {
      console.error(err)
      setStatus('Capture failed')
    }
  }

  const stopIdentification = (isMatchFound = false) => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    setIsListening(false)

    if (isMatchFound) {
      setStatus('Success')
    } else {
      setStatus('No match found')
    }
  }

  const sendAudioToServer = async (blob: Blob) => {
    // Prevent processing if we just found a match or stopped manually
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      return
    }

    const formData = new FormData()
    formData.append('audio', blob, 'chunk.webm')

    setStatus('Identifying')
    try {
      const response = await fetch('http://localhost:3001/identify', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.match) {
        setMatch(data.song)
        stopIdentification(true)
      } else {
        attemptsRef.current += 1
        if (attemptsRef.current >= 3) {
          stopIdentification(false)
        } else {
          setStatus('Still Listening')
        }
      }
    } catch (err) {
      console.error(err)
      setStatus('Connection Failed')
      stopIdentification()
    }
  }

  return (
    <div className="container">
      <h1>Echo</h1>

      <div className={`shazam-button-container ${isListening ? 'listening' : ''}`}>
        <div className="pulse-ring"></div>
        <div
          className="shazam-button"
          onClick={() => (isListening ? stopIdentification() : startIdentification())}
        >
          <div className="inner">
            {isListening ? (
              <Search size={40} strokeWidth={2.5} className="spin" />
            ) : (
              <Mic size={40} strokeWidth={2.5} />
            )}
          </div>
        </div>
      </div>

      <p className="status">{isListening ? 'Scanning Audio...' : status}</p>

      {match && (
        <div className="match-card">
          <div
            className="match-icon-wrapper"
            style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}
          >
            <Disc size={28} />
          </div>
          <div className="match-info">
            <h3>Identified</h3>
            <p title={match}>{match}</p>
          </div>
        </div>
      )}

      {status === 'No match found' && !match && (
        <div className="match-card">
          <div
            className="match-icon-wrapper"
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
          >
            <AlertCircle size={28} />
          </div>
          <div className="match-info">
            <h3>Unknown</h3>
            <p>Audio not found in library</p>
          </div>
        </div>
      )}
    </div>
  )
}
