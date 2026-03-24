import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { BreedResponse } from '@/module/breed/breed.response'
import { Kind } from '@/module/breed/type/kind.enum'

import { encode } from '@/helper/string'

import { Spec } from '../spec'

describe('breed module', async () => {
  const spec = await Spec.build()

  const value = encode(`${process.env.USER}:${process.env.PASS}`)

  beforeAll(async () => {
    await spec.start()

    await spec.application
      .inject()
      .post('/configuration/breed')
      .headers({ Authorization: `Basic ${value}` })
      .end()
  })

  describe('/breed', () => {
    test('should list cat', async () => {
      const { json } = await spec.application.inject().get('/breed').query({ kind: Kind.CAT }).end()

      const result = json<BreedResponse[]>()

      expect(result).toHaveLength(25)

      expect(result[1]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String)
      })
    })

    test('should list dog', async () => {
      const { json } = await spec.application.inject().get('/breed').query({ kind: Kind.DOG }).end()

      const result = json<BreedResponse[]>()

      expect(result).toHaveLength(42)

      expect(result[1]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String)
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
