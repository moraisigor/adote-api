import { HttpStatus } from '@nestjs/common'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'

import { HealthModule } from '@/module/health/health.module'

describe('health module', async () => {
  let application: NestFastifyApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HealthModule]
    }).compile()

    application = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    await application.init()
    await application.getHttpAdapter().getInstance().ready()
  })

  describe('/get', () => {
    test('should verify health', async () => {
      const { json } = await application.inject().get('/health').end()

      const result = json<{ state: boolean }>()

      expect(result).toMatchObject({
        state: true
      })
    })
  })

  afterAll(async () => {
    await application.close()
  })
})
