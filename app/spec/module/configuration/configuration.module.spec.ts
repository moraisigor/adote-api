import type { BreedResponse } from '@/module/breed/breed.response'
import type { LocationResponse } from '@/module/location/location.response'
import type { UserResponse } from '@/module/user/user.response'

import { Spec } from '../spec'

describe('configuration module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
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
        name: 'Dev',
        phone: '+5599999999999'
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

      const breed = response.find((e) => e.name.toLowerCase() === 'buldogue inglês')

      expect(response).toHaveLength(67)

      expect(breed).toMatchObject({
        id: expect.any(String),
        name: 'Buldogue Inglês'
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

      const location = response.find((e) => e.city.toLowerCase() === 'recife')

      expect(response).toHaveLength(5694)

      expect(location).toMatchObject({
        id: expect.any(String),
        city: 'Recife',
        state: 'Pernambuco'
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
