import { hc } from 'hono/client'
import type { AppType } from '@cdiscam/api/app'

// credentials: 'include' pour envoyer le cookie httpOnly du JWT
export const api = hc<AppType>('/', {
  init: { credentials: 'include' },
}).api
