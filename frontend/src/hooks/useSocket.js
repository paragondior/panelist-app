import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const useSocket = ({ sessionId, onSpeakerUpdated } = {}) => {
  const socketRef = useRef(null)
  const speakerUpdatedRef = useRef(onSpeakerUpdated)

  useEffect(() => {
    speakerUpdatedRef.current = onSpeakerUpdated
  }, [onSpeakerUpdated])

  useEffect(() => {
    if (!sessionId) {
      return undefined
    }

    const socket = io(socketUrl, { autoConnect: true })
    socketRef.current = socket

    const handleSpeakerUpdated = (payload) => {
      speakerUpdatedRef.current?.(payload)
    }

    socket.on('session:speaker-updated', handleSpeakerUpdated)

    return () => {
      socket.off('session:speaker-updated', handleSpeakerUpdated)
      socket.disconnect()
      socketRef.current = null
    }
  }, [sessionId])

  useEffect(() => {
    const socket = socketRef.current

    if (!socket || !sessionId) {
      return undefined
    }

    socket.emit('joinSession', sessionId)

    return () => {
      socket.emit('leaveSession', sessionId)
    }
  }, [sessionId])

  return {
    connect: () => socketRef.current?.connect(),
    disconnect: () => socketRef.current?.disconnect(),
    joinSession: (id) => socketRef.current?.emit('joinSession', id),
    leaveSession: (id) => socketRef.current?.emit('leaveSession', id),
    on: (event, listener) => socketRef.current?.on(event, listener),
    off: (event, listener) => socketRef.current?.off(event, listener),
  }
}