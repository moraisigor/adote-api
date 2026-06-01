import { HttpStatus } from '@nestjs/common/enums'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import type { UserResponse } from '@/module/user/user.response'

import { Spec } from '../spec'

describe('user module', () => {
  describe('as manager', async () => {
    const spec = await Spec.build()

    beforeAll(async () => {
      await spec.start()

      await spec.scenario.manager()
    })

    // get /user
    describe('/user', () => {
      test('should list user', async () => {
        const {
          authorization: { token: { hash } = { hash: '' } }
        } = spec.scenario

        const { statusCode: status, json } = await spec.application
          .inject()
          .get('/user')
          .headers({ Authorization: `Bearer ${hash}` })
          .end()

        const response = json<UserResponse[]>()

        expect(status).toBe(HttpStatus.OK)

        expect(response).toHaveLength(1)

        expect(response).toMatchObject([
          {
            id: expect.any(String),
            phone: '+5599999999999',
            name: 'Dev'
          }
        ])
      })
    })

    afterAll(async () => {
      await spec.stop()
    })
  })
})
