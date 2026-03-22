import { HttpStatus } from '@nestjs/common'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { HealthModule } from '@/module/health/health.module'

describe('health controller', async () => {
  const module = await Test.createTestingModule({
    imports: [HealthModule]
  }).compile()

  const application = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

  await application.init()
  await application.getHttpAdapter().getInstance().ready()

  describe('/get', () => {
    test('should return http code 200', async () => {
      const result = await application.inject({
        url: '/health',
        method: 'GET'
      })

      const { statusCode: code } = result

      expect(code).toBe(HttpStatus.OK)
    })
  })

  afterAll(async () => {
    await application.close()
  })
})
