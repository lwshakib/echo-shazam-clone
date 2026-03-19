import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi, describe } from 'vitest'
import App from '../popup/App'

// Mock Lucide icons or just let them render as SVG
vi.mock('lucide-react', async () => {
  const original = await vi.importActual('lucide-react')
  return {
    ...original,
    Mic: () => <div data-testid="mic-icon" />,
    Search: () => <div data-testid="search-icon" />,
    Disc: () => <div data-testid="disc-icon" />,
    AlertCircle: () => <div data-testid="alert-icon" />,
  }
})

describe('Echo Extension UI Tests', () => {
  test('renders Echo header and Mic button', () => {
    render(<App />)
    expect(screen.getByText('Echo')).toBeTruthy()
    expect(screen.getByTestId('mic-icon')).toBeTruthy()
  })

  test('updates status on click', async () => {
    render(<App />)
    const button = screen.getByTestId('mic-icon').parentElement?.parentElement
    if (button) {
      fireEvent.click(button)
    }
    // Initially, startIdentification is called
    // Since we mocked chrome.tabCapture, we can check if it was called
    expect(global.chrome.tabCapture.capture).toHaveBeenCalled()
  })
})
