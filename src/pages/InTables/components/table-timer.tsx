'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

interface TableTimerProps {
  isRunning: boolean
  onTimeUp: () => void
}

const INITIAL_TIME = 15 * 60

export function TableTimer({ isRunning, onTimeUp }: TableTimerProps) {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval)
            onTimeUp()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (!isRunning) {
      setTimeLeft(INITIAL_TIME) // Reset thời gian khi bàn được giải phóng
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning, timeLeft, onTimeUp])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeLeft < 60) return 'text-red-500 font-bold'
    if (timeLeft < 300) return 'text-amber-500'
    return 'text-green-500'
  }

  return (
    <Badge variant='outline' className={`font-mono ${getTimerColor()}`}>
      {formatTime(timeLeft)}
    </Badge>
  )
}
