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
import { ConfigurationModule } from '@/module/configuration/configuration.module'
import { HealthModule } from '@/module/health/health.module'
import { LocationModule } from '@/module/location/location.module'
import type { LocationResponse } from '@/module/location/location.response'
import { MessageModule } from '@/module/message/message.module'
import { OrganizationModule } from '@/module/organization/organization.module'
import { PetModule } from '@/module/pet/pet.module'
import type { PetResponse } from '@/module/pet/pet.response'
import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'
import { PostModule } from '@/module/post/post.module'
import { UserModule } from '@/module/user/user.module'

import { encode } from '@/helper/string'

import { RouteConfig } from '@/router.config.factory'

export type Result = {
  pet?: PetResponse
  // support
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
        PostModule,
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

  // support
  async breed() {
    const { basic } = this.authorization

    const { json } = await this.application
      .inject()
      .post('/configuration/breed')
      .headers({ Authorization: `Basic ${basic}` })
      .end()

    this.result.breed = json<BreedResponse[]>()
  }

  // support
  async location() {
    const { basic } = this.authorization

    const { json } = await this.application
      .inject()
      .post('/configuration/location')
      .headers({ Authorization: `Basic ${basic}` })
      .end()

    this.result.location = json<LocationResponse[]>()
  }

  async pet() {
    const { token } = this.authorization

    const { id: breed } = this.result.breed.find((e) => e.name.toLowerCase() === 'buldogue inglês') ?? {
      breed: ''
    }

    const { json } = await this.application
      .inject()
      .post('/pet')
      .headers({ Authorization: `Bearer ${token?.hash}` })
      .body({
        name: 'Oreo',
        size: Size.MEDIUM,
        gender: Gender.MALE,
        breed: breed
      })
      .end()

    this.result.pet = json<PetResponse>()
  }

  async user() {
    const { token } = this.authorization

    const { id: location } = this.result.location.find((e) => e.city.toLowerCase() === 'recife') ?? {
      location: ''
    }

    await this.application
      .inject()
      .put('/user')
      .headers({ Authorization: `Bearer ${token?.hash}` })
      .body({
        name: 'Name',
        image: 'image.jpg',
        contact: {
          mail: 'mail@example.com',
          phone: '+5599999999999',
          social: 'https://example.com/name'
        },
        location: location
      })
      .end()
  }

  async authenticate() {
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
