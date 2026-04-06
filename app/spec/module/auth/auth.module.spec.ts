import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { TokenResponse, type AuthResponse } from '@/module/auth/auth.response'

import { Spec } from '../spec'

type Result = {
  auth?: AuthResponse
  token?: TokenResponse
}

describe('auth module', async () => {
  const spec = await Spec.build()

  const result: Result = {}

  beforeAll(async () => {
    await spec.start()
  })

  // /auth
  test('should start auth', async () => {
    const { json } = await spec.application
      .inject()
      .post('/auth')
      .body({
        phone: '+5599999999999'
      })
      .end()

    const response = json<AuthResponse>()

    result.auth = response

    expect(response).toMatchObject({
      id: expect.any(String),
      key: expect.any(String),
      phone: '+5599999999999'
    })
  })

  // /auth/key
  test('should auth user with key', async () => {
    const { auth: { key } = { key: '' } } = result

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

  // /auth/verify
  test('should auth user with code', async () => {
    const { auth: { phone } = { phone: '' } } = result

    const { json } = await spec.application
      .inject()
      .post('/auth/verify')
      .body({
        phone,
        code: '999999'
      })
      .end()

    const response = json<TokenResponse>()

    result.token = response

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

  // /auth/renew
  test('should renew auth', async () => {
    const { token: { renew: { hash } } = { renew: { hash: '' } } } = result

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

  afterAll(async () => {
    await spec.stop()
  })
})
