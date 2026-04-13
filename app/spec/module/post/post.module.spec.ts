import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'
import type { PostResponse } from '@/module/post/post.response'

import { Spec } from '../spec'

describe('post module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.post()
  })

  // post /post
  describe('/post', () => {
    test('should create post', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id: pet } = await spec.scenario.build.pet.create()

      const { json } = await spec.application
        .inject()
        .post('/post')
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          image: ['image.jpg'],
          pet: pet,
          publish: true
        })
        .end()

      const response = json<PostResponse>()

      expect(response).toMatchObject({
        id: expect.any(String),
        image: ['image.jpg'],
        pet: {
          id: expect.any(String),
          name: 'Oreo',
          size: Size.MEDIUM,
          gender: Gender.MALE,
          breed: {
            id: expect.any(String),
            name: 'Buldogue Inglês'
          }
        },
        user: {
          id: expect.any(String),
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
        }
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
