// src/components/GoogleOneTap.tsx
import React, { useEffect } from 'react'
import type {
  CredentialResponse,
  PromptMomentNotification,
} from '@react-oauth/google'

declare global {
  interface Window { google?: any }
}

interface Props {
  onSuccess: (res: CredentialResponse) => void
  onError: (err: Error) => void
}

export default function GoogleOneTap({ onSuccess, onError }: Props) {
  useEffect(() => {
    const g = window.google
    if (!g?.accounts?.id) {
      onError(new Error('One-Tap library not loaded'))
      return
    }

    // clear any pending FedCM calls
    g.accounts.id.cancel()

    g.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (c: any) => onSuccess({ credential: c.credential }),
      context: 'use',
      ux_mode: 'popup',
      allowed_parent_origin: window.location.origin,
    })

    g.accounts.id.prompt((moment: PromptMomentNotification) => {
      if (
        moment.isNotDisplayed() ||
        moment.isSkippedMoment() ||
        moment.isDismissedMoment()
      ) {
        onError(new Error('One-Tap prompt not shown'))
      }
    })
  }, [onSuccess, onError])

  return null
}
