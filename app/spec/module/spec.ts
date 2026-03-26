import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { RouterModule } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, type TestingModule } from '@nestjs/testing'

import { MongoMemoryServer } from 'mongodb-memory-server'

import { AuthModule } from '@/module/auth/auth.module'
import type { TokenResponse } from '@/module/auth/auth.response'
import type { Token } from '@/module/auth/type/token'
import { BreedModule } from '@/module/breed/breed.module'
import type { BreedResponse } from '@/module/breed/breed.response'
import type { Kind } from '@/module/breed/type/kind.enum'
import { ConfigurationModule } from '@/module/configuration/configuration.module'
import { HealthModule } from '@/module/health/health.module'
import { LocationModule } from '@/module/location/location.module'
import type { LocationResponse } from '@/module/location/location.response'
import { MessageModule } from '@/module/message/message.module'
import { OrganizationModule } from '@/module/organization/organization.module'
import { PetModule } from '@/module/pet/pet.module'
import { UserModule } from '@/module/user/user.module'

import { encode } from '@/helper/string'

import { RouteConfig } from '@/router.config.factory'

export type Result = {
  breed: BreedResponse[]
  location: LocationResponse[]
}

export type Authorization = {
  basic: string
  // auth
  token?: Token
  renew?: Token
}

export class Spec {
  public result: Result = {
    breed: [],
    location: []
  }

  public authorization: Authorization = {
    basic: encode(`${process.env.USER}:${process.env.PASS}`)
  }

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
        PetModule,
        UserModule,
        RouterModule.register(RouteConfig),
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

  async breed() {
    const { basic } = this.authorization

    const { json } = await this.application
      .inject()
      .post('/configuration/breed')
      .headers({ Authorization: `Basic ${basic}` })
      .end()

    this.result.breed = json<BreedResponse[]>()
  }

  async location() {
    const { basic } = this.authorization

    const { json } = await this.application
      .inject()
      .post('/configuration/location')
      .headers({ Authorization: `Basic ${basic}` })
      .end()

    this.result.location = json<LocationResponse[]>()
  }

  async authenticate() {
    const { basic } = this.authorization

    await this.application
      .inject()
      .post('/configuration/user')
      .headers({ Authorization: `Basic ${basic}` })
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

    const result = json<TokenResponse>()

    this.authorization.token = result.token
    this.authorization.renew = result.renew
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
