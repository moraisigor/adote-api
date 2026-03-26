import type { PetResponse } from '@/module/pet/pet.response'
import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'

import { Spec } from '../spec'

describe('pet module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    // support
    await spec.breed()

    await spec.authenticate()
  })

  describe('/pet', () => {
    test('should create pet', async () => {
      const { token } = spec.authorization

      const { id: breed } = spec.result.breed.find((e) => e.name.toLowerCase() === 'buldogue inglês') ?? {
        breed: ''
      }

      const { json } = await spec.application
        .inject()
        .post('/pet')
        .headers({ Authorization: `Bearer ${token?.hash}` })
        .body({
          name: 'Oreo',
          size: Size.MEDIUM,
          gender: Gender.MALE,
          breed: breed
        })
        .end()

      const response = json<PetResponse>()

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Oreo',
        size: Size.MEDIUM,
        gender: Gender.MALE,
        breed: {
          id: expect.any(String),
          name: 'Buldogue Inglês'
        }
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
