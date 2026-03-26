import type { BreedResponse } from '@/module/breed/breed.response'
import type { LocationResponse } from '@/module/location/location.response'
import type { UserResponse } from '@/module/user/user.response'

import { Spec } from '../spec'

describe('configuration module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.breed()
  })

  describe('/configuration/user', () => {
    test('should set user', async () => {
      const { basic } = spec.authorization

      const { json } = await spec.application
        .inject()
        .post('/configuration/user')
        .headers({ Authorization: `Basic ${basic}` })
        .end()

      const response = json<UserResponse>()

      expect(response).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        name: expect.any(String),
        phone: expect.any(String)
      })
    })
  })

  describe('/configuration/breed', () => {
    test('should set breed', async () => {
      const { basic } = spec.authorization

      const { json } = await spec.application
        .inject()
        .post('/configuration/breed')
        .headers({ Authorization: `Basic ${basic}` })
        .end()

      const response = json<BreedResponse[]>()

      expect(response).toHaveLength(67)

      expect(response[1]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String)
      })
    })
  })

  describe('/configuration/location', () => {
    test('should set location', async () => {
      const { basic } = spec.authorization

      const { json } = await spec.application
        .inject()
        .post('/configuration/location')
        .headers({
          Authorization: `Basic ${basic}`
        })
        .end()

      const response = json<LocationResponse[]>()

      expect(response).toHaveLength(5694)

      expect(response[1]).toMatchObject({
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
