import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { BreedResponse } from '@/module/breed/breed.response'
import { Kind } from '@/module/breed/type/kind.enum'

import { Spec } from '../spec'

describe('breed module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.breed()
  })

  describe('/breed', () => {
    test('should list cat', async () => {
      const { json } = await spec.application.inject().get('/breed').query({ kind: Kind.CAT }).end()

      const response = json<BreedResponse[]>()

      const breed = response.find((e) => e.name.toLowerCase() === 'sem raça definida')

      expect(response).toHaveLength(25)

      expect(breed).toMatchObject({
        id: expect.any(String),
        name: 'Sem Raça Definida'
      })
    })

    test('should list dog', async () => {
      const { json } = await spec.application.inject().get('/breed').query({ kind: Kind.DOG }).end()

      const response = json<BreedResponse[]>()

      const breed = response.find((e) => e.name.toLowerCase() === 'buldogue inglês')

      expect(response).toHaveLength(42)

      expect(breed).toMatchObject({
        id: expect.any(String),
        name: 'Buldogue Inglês'
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
