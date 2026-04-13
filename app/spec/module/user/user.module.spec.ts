import type { UserResponse } from '@/module/user/user.response'

import { Spec } from '../spec'

describe('user module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.user()
  })

  // put /user
  describe('/user', () => {
    test('should save user', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const [{ id: location }] = await spec.scenario.build.location.search()

      const { json } = await spec.application
        .inject()
        .put('/user')
        .headers({ Authorization: `Bearer ${hash}` })
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
