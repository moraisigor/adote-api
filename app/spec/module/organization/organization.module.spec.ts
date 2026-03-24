import type { TokenResponse } from '@/module/auth/auth.response'
import type { OrganizationResponse } from '@/module/organization/organization.response'

import { Spec } from '../spec'

describe('organization module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
    await spec.basic()
  })

  describe('/organization', () => {
    test('should create organization', async () => {
      const {
        token: { hash }
      } = spec.token ?? { token: { hash: '' } }

      const { json } = await spec.application
        .inject()
        .post('/organization')
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          name: 'Name'
        })
        .end()

      const result = json<OrganizationResponse[]>()

      expect(result).toMatchObject({
        id: expect.any(String),
        name: expect.any(String)
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
