import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, type TestingModule } from '@nestjs/testing'

import { MongoMemoryServer } from 'mongodb-memory-server'

import type { TokenResponse } from '@/module/auth/auth.response'
import { SetUserProvider } from '@/module/configuration/provider/set.user.provider'
import { HealthModule } from '@/module/health/health.module'

export class Spec {
  constructor(
    readonly module: TestingModule,
    readonly application: NestFastifyApplication,
    private readonly repository: MongoMemoryServer
  ) {}

  public static build = async () => {
    const repository = await MongoMemoryServer.create()

    const module = await Test.createTestingModule({
      imports: [HealthModule]
    }).compile()

    const application = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    return new Spec(module, application, repository)
  }

  async token() {
    const provider = this.module.get(SetUserProvider)

    const user = await provider.run()

    console.log(user)

    const { json } = await this.application
      .inject()
      .post('/auth/verify')
      .body({
        phone: '+5599999999999',
        code: '999999'
      })
      .end()

    return json<TokenResponse>()
  }

  async start() {
    await this.application.init()
    await this.application.getHttpAdapter().getInstance().ready()
  }

  async stop() {
    await this.repository.stop()
    await this.application.close()
  }
}
