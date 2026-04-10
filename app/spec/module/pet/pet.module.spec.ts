import type { BreedResponse } from '@/module/breed/breed.response'
import { Kind } from '@/module/breed/type/kind.enum'
import type { PetResponse } from '@/module/pet/pet.response'
import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'

import { Spec } from '../spec'

type Result = {
  breed?: BreedResponse[]
}

describe('pet module', async () => {
  const spec = await Spec.build()

  const result: Result = {}

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.pet()

    const { json } = await spec.application.inject().get('/breed').query({ kind: Kind.DOG }).end()

    result.breed = json<BreedResponse[]>()
  })

  // /pet
  test('should create pet', async () => {
    const {
      authorization: { token: { hash } = { hash: '' } }
    } = spec.scenario

    const { id: breed } = result.breed?.find((e) => e.name === 'Buldogue Inglês') ?? { id: null }

    const { json } = await spec.application
      .inject()
      .post('/pet')
      .headers({ Authorization: `Bearer ${hash}` })
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

  afterAll(async () => {
    await spec.stop()
  })
})
