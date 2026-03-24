import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { LocationResponse } from '@/module/location/location.response'

import { encode } from '@/helper/string'

import { Spec } from '../spec'

describe('location module', async () => {
  const spec = await Spec.build()

  const value = encode(`${process.env.USER}:${process.env.PASS}`)

  beforeAll(async () => {
    await spec.start()

    await spec.application
      .inject()
      .post('/configuration/location')
      .headers({ Authorization: `Basic ${value}` })
      .end()
  })

  describe('/location', async () => {
    test('should list location', async () => {
      const { json } = await spec.application.inject().get('/location').query({ search: 'Recife' }).end()

      const result = json<LocationResponse[]>()

      expect(result).toHaveLength(1)

      expect(result).toMatchObject([
        {
          id: expect.any(String),
          city: 'Recife',
          state: 'Pernambuco'
        }
      ])
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
