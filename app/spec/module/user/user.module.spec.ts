import type { UserResponse } from '@/module/user/user.response'

import { Spec } from '../spec'

describe('user module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.authenticate()

    await spec.location()
  })

  describe('/user', () => {
    test('should save user', async () => {
      const { token } = spec.authorization

      const { id: location } = spec.result.location.find((e) => e.city.toLowerCase() === 'recife') ?? {
        location: ''
      }

      const { json } = await spec.application
        .inject()
        .put('/user')
        .headers({ Authorization: `Bearer ${token?.hash}` })
        .body({
          name: 'Name',
          contact: {
            mail: 'mail@example.com',
            phone: '+5599999999999',
            social: 'https://example.com/name'
          },
          location: location
        })
        .end()

      const response = json<UserResponse>()

      expect(response).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        phone: '+5599999999999',
        name: 'Name',
        contact: {
          mail: 'mail@example.com',
          phone: '+5599999999999',
          social: 'https://example.com/name'
        },
        location: {
          id: expect.any(String),
          city: 'Recife',
          state: 'Pernambuco'
        }
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
