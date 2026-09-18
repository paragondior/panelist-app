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
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return undefined
    }

    const socket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
    })

    socketRef.current = socket

    const handleSpeakerUpdated = (payload) => {
      if (payload?.sessionId && payload.sessionId !== sessionId) {
        return
      }

      speakerUpdatedRef.current?.(payload)
    }

    const joinSessionRoom = () => {
      if (!socket.connected || !sessionId) {
        return
      }

      socket.emit('joinSession', sessionId, (response) => {
        if (response && response.success === false) {
          console.warn('Socket room join failed:', response.message || 'Unknown error')
        }
      })
    }

    const handleSocketError = (error) => {
      console.warn('Socket error:', error)
    }

    socket.on('connect', joinSessionRoom)
    socket.on('reconnect', joinSessionRoom)
    socket.on('session:speaker-updated', handleSpeakerUpdated)
    socket.on('socket:error', handleSocketError)

    joinSessionRoom()

    return () => {
      socket.off('connect', joinSessionRoom)
      socket.off('reconnect', joinSessionRoom)
      socket.off('session:speaker-updated', handleSpeakerUpdated)
      socket.off('socket:error', handleSocketError)
      socket.emit('leaveSession', sessionId)
      socket.disconnect()
      socketRef.current = null
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