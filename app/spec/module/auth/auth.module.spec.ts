import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { AuthResponse, TokenResponse } from '@/module/auth/auth.response'

import { Spec } from '../spec'

describe('auth module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  describe('/auth', () => {
    test('should auth user', async () => {
      const { json } = await spec.application
        .inject()
        .post('/auth')
        .body({
          phone: '+5599999999999'
        })
        .end()

      const result = json<AuthResponse>()

      expect(result).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        phone: expect.any(String)
      })
    })
  })

  describe('/auth/verify', () => {
    test('should verify user', async () => {
      const { json } = await spec.application
        .inject()
        .post('/auth/verify')
        .body({
          phone: '+5599999999999',
          code: '999999'
        })
        .end()

      const result = json<TokenResponse>()

      expect(result).toMatchObject({
        token: {
          hash: expect.any(String),
          expire: expect.any(Number)
        },
        renew: {
          hash: expect.any(String),
          expire: expect.any(Number)
        }
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
