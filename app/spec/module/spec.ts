import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, type TestingModule } from '@nestjs/testing'

import { MongoMemoryServer } from 'mongodb-memory-server'

import { AuthModule } from '@/module/auth/auth.module'
import type { TokenResponse } from '@/module/auth/auth.response'
import { BreedModule } from '@/module/breed/breed.module'
import { ConfigurationModule } from '@/module/configuration/configuration.module'
import { HealthModule } from '@/module/health/health.module'
import { LocationModule } from '@/module/location/location.module'
import { MessageModule } from '@/module/message/message.module'
import { OrganizationModule } from '@/module/organization/organization.module'
import { UserModule } from '@/module/user/user.module'

import { encode } from '@/helper/string'

export class Spec {
  public token?: TokenResponse

  constructor(
    readonly module: TestingModule,
    readonly application: NestFastifyApplication,
    private readonly repository: MongoMemoryServer
  ) {}

  public static build = async () => {
    const repository = await MongoMemoryServer.create()

    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        BreedModule,
        ConfigurationModule,
        HealthModule,
        LocationModule,
        MessageModule,
        OrganizationModule,
        UserModule,
        // dependency
        JwtModule,
        PassportModule,
        CacheModule.register({
          ttl: 2 * 60 * 1000
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test'
        }),
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: repository.getUri()
          })
        })
      ],
      providers: []
    }).compile()

    const application = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    return new Spec(module, application, repository)
  }

  async basic() {
    const value = encode(`${process.env.USER}:${process.env.PASS}`)

    await this.application
      .inject()
      .post('/configuration/user')
      .headers({ Authorization: `Basic ${value}` })
      .end()

    await this.application.inject().post('/auth').body({ phone: '+5599999999999' }).end()

    const { json } = await this.application
      .inject()
      .post('/auth/verify')
      .body({
        phone: '+5599999999999',
        code: '999999'
      })
      .end()

    this.token = json<TokenResponse>()
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
