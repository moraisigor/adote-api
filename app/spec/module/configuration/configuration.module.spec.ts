import type { BreedResponse } from '@/module/breed/breed.response'
import type { LocationResponse } from '@/module/location/location.response'
import type { UserResponse } from '@/module/user/user.response'

import { Spec } from '../spec'

describe('configuration module', async () => {
  const spec = await Spec.build()

  beforeAll(async () => {
    await spec.start()
  })

  // /configuration/breed
  test('should set breed', async () => {
    const { BASIC_AUTHORIZATION } = spec.scenario

    const { json } = await spec.application
      .inject()
      .post('/configuration/breed')
      .headers({ Authorization: `Basic ${BASIC_AUTHORIZATION}` })
      .end()

    const response = json<BreedResponse[]>()

    expect(response).toHaveLength(67)
  })

  // /configuration/location
  test('should set location', async () => {
    const { BASIC_AUTHORIZATION } = spec.scenario

    const { json } = await spec.application
      .inject()
      .post('/configuration/location')
      .headers({ Authorization: `Basic ${BASIC_AUTHORIZATION}` })
      .end()

    const response = json<LocationResponse[]>()

    expect(response).toHaveLength(5694)
  })

  // /configuration/user
  test('should set user', async () => {
    const { BASIC_AUTHORIZATION } = spec.scenario

    const { json } = await spec.application
      .inject()
      .post('/configuration/user')
      .headers({ Authorization: `Basic ${BASIC_AUTHORIZATION}` })
      .end()

    const response = json<UserResponse>()

    expect(response).toMatchObject({
      id: expect.any(String),
      key: expect.any(String),
      name: 'Dev',
      phone: '+5599999999999'
    })
  })

  afterAll(async () => {
    await spec.stop()
  })
})
