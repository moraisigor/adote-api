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

      expect(response).toHaveLength(25)

      expect(response[1]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String)
      })
    })

    test('should list dog', async () => {
      const { json } = await spec.application.inject().get('/breed').query({ kind: Kind.DOG }).end()

      const response = json<BreedResponse[]>()

      expect(response).toHaveLength(42)

      expect(response[1]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String)
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
