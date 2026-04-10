import type { FavResponse } from '@/module/fav/fav.response'
import type { PostResponse } from '@/module/post/post.response'

import { Spec } from '../spec'

type Result = {
  post?: PostResponse
}

describe('fav module', async () => {
  const spec = await Spec.build()

  const result: Result = {}

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.fav()

    result.post = await spec.scenario.build.post.create()
  })

  // /fav/:post
  test('should add fav', async () => {
    const {
      authorization: { token: { hash } = { hash: '' } }
    } = spec.scenario

    const { id: post } = result.post ?? { id: null }

    const { json } = await spec.application
      .inject()
      .post(`/user/fav/${post}`)
      .headers({ Authorization: `Bearer ${hash}` })
      .end()

    const response = json<FavResponse>()

    expect(response).toMatchObject({
      id: post
    })
  })

  // /fav/:post
  test('should remove fav', async () => {
    const {
      authorization: { token: { hash } = { hash: '' } }
    } = spec.scenario

    const { id: post } = result.post ?? { id: null }

    const { json } = await spec.application
      .inject()
      .delete(`/user/fav/${post}`)
      .headers({ Authorization: `Bearer ${hash}` })
      .end()

    const response = json<FavResponse>()

    expect(response).toMatchObject({
      id: post
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
