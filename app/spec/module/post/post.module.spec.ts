import { Spec } from '../spec'

describe('post module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  afterAll(async () => {
    await spec.stop()
  })
})
