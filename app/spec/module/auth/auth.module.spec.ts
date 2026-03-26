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

      const response = json<AuthResponse>()

      expect(response).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        phone: '+5599999999999'
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

      const response = json<TokenResponse>()

      expect(response).toMatchObject({
        token: {
          hash: expect.any(String),
          expire: Number(process.env.TOKEN_EXPIRE)
        },
        renew: {
          hash: expect.any(String),
          expire: Number(process.env.TOKEN_RENEW_EXPIRE)
        }
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
