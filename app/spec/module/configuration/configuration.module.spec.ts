import type { LocationResponse } from '@/module/location/location.response'
import type { UserResponse } from '@/module/user/user.response'

import { encode } from '@/helper/string'

import { Spec } from '../spec'

describe('configuration module', async () => {
  const spec = await Spec.build()

  const value = encode(`${process.env.USER}:${process.env.PASS}`)

  beforeAll(async () => {
    await spec.start()
  })

  describe('/configuration/user', () => {
    test('should set user', async () => {
      const { json } = await spec.application
        .inject()
        .post('/configuration/user')
        .headers({ Authorization: `Basic ${value}` })
        .end()

      const result = json<UserResponse>()

      expect(result).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        name: expect.any(String),
        phone: expect.any(String)
      })
    })
  })

  describe('/configuration/location', () => {
    test('should set location', async () => {
      const { json } = await spec.application
        .inject()
        .post('/configuration/location')
        .headers({
          Authorization: `Basic ${value}`
        })
        .end()

      const result = json<LocationResponse[]>()

      expect(result).toHaveLength(5694)

      expect(result[1]).toMatchObject({
        id: expect.any(String),
        city: expect.any(String),
        state: expect.any(String)
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
