import type { TokenResponse } from '@/module/auth/auth.response'
import type { OrganizationResponse } from '@/module/organization/organization.response'

import { Spec } from '../spec'

describe('organization module', async () => {
  const spec = await Spec.build()

  let token: TokenResponse

  beforeAll(async () => {
    await spec.start()

    token = await spec.token()
  })

  describe('/organization', () => {
    test('should create organization', async () => {
      const {
        token: { hash }
      } = token

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
