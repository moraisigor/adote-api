import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { TokenResponse, type AuthResponse } from '@/module/auth/auth.response'

import { Spec } from '../spec'

describe('auth module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  // /auth
  describe('/auth', () => {
    test('should start auth', async () => {
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

  // /auth/key
  describe('/auth/key', () => {
    test('should auth user with key', async () => {
      const { key } = await spec.scenario.build.auth.auth()

      const { json } = await spec.application.inject().post('/auth/key').headers({ Key: key }).end()

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

  // /auth/verify
  describe('/auth/verify', () => {
    test('should auth user with code', async () => {
      const { phone } = await spec.scenario.build.auth.auth()

      const { json } = await spec.application
        .inject()
        .post('/auth/verify')
        .body({
          phone,
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

  // /auth/renew
  describe('/auth/renew', () => {
    test('should renew auth', async () => {
      const {
        renew: { hash }
      } = await spec.scenario.build.auth.key()

      const { json } = await spec.application
        .inject()
        .post('/auth/renew')
        .headers({ Authorization: `Bearer ${hash}` })
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
