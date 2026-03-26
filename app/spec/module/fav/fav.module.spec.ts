import type { FavResponse } from '@/module/fav/fav.response'

import { Spec } from '../spec'

describe('fav module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    // support
    await spec.breed()
    await spec.location()

    // authenticate
    await spec.authenticate()

    // user
    await spec.user()

    await spec.pet()
    await spec.post()
  })

  describe('/fav', () => {
    test('should add fav', async () => {
      const { token } = spec.authorization

      const { post: { id: post } = { id: '' } } = spec.result

      const { json } = await spec.application
        .inject()
        .post(`/user/fav/${post}`)
        .headers({ Authorization: `Bearer ${token?.hash}` })
        .end()

      const response = json<FavResponse>()

      expect(response).toMatchObject({
        id: expect.any(String)
      })
    })

    test('should remove fav', async () => {
      const { token } = spec.authorization

      const { post: { id: post } = { id: '' } } = spec.result

      const { json } = await spec.application
        .inject()
        .delete(`/user/fav/${post}`)
        .headers({ Authorization: `Bearer ${token?.hash}` })
        .end()

      const response = json<FavResponse>()

      expect(response).toMatchObject({
        id: expect.any(String)
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
