import type { OrganizationResponse } from '@/module/organization/organization.response'

import { Spec } from '../spec'

describe('organization module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()

    await spec.scenario.organization()
  })

  // post /organization
  describe('/organization', () => {
    test('should create organization', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { json } = await spec.application
        .inject()
        .post('/organization')
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          name: 'Create'
        })
        .end()

      const response = json<OrganizationResponse>()

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Create'
      })
    })
  })

  // put /organization
  describe('/organization', () => {
    test('should save organization', async () => {
      const {
        authorization: { token: { hash } = { hash: '' } }
      } = spec.scenario

      const { id: organization } = await spec.scenario.build.organization.create()

      const { json } = await spec.application
        .inject()
        .put(`/organization/${organization}`)
        .headers({ Authorization: `Bearer ${hash}` })
        .body({
          name: 'Save',
          contact: {
            mail: 'mail@example.com',
            phone: '+5599999999999'
          }
        })
        .end()

      const response = json<OrganizationResponse>()

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Save',
        contact: {
          mail: 'mail@example.com',
          phone: '+5599999999999'
        }
      })
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
