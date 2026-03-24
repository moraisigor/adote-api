import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { Spec } from '../spec'

describe('health module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  describe('/get', () => {
    test('should verify health', async () => {
      const { json } = await spec.application.inject().get('/health').end()

      const result = json<{ state: boolean }>()

      expect(result).toMatchObject({
        state: true
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
