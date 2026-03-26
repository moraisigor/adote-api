import type { OrganizationResponse } from '@/module/organization/organization.response'

import { Spec } from '../spec'

describe('organization module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.authenticate()
  })

  describe('/organization', () => {
    test('should create organization', async () => {
      const { token } = spec.authorization

      const { json } = await spec.application
        .inject()
        .post('/organization')
        .headers({ Authorization: `Bearer ${token?.hash}` })
        .body({
          name: 'Name'
        })
        .end()

      const response = json<OrganizationResponse[]>()

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Name'
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
