import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import type { AuthResponse, TokenResponse } from '@/module/auth/auth.response'
import type { Token } from '@/module/auth/type/token'
import type { BreedResponse } from '@/module/breed/breed.response'
import { Kind } from '@/module/breed/type/kind.enum'
import type { FavResponse } from '@/module/fav/fav.response'
import type { LocationResponse } from '@/module/location/location.response'
import type { PetResponse } from '@/module/pet/pet.response'
import { Gender } from '@/module/pet/type/gender'
import { Size } from '@/module/pet/type/size'
import type { PostResponse } from '@/module/post/post.response'
import type { UserResponse } from '@/module/user/user.response'

import { encode } from '@/helper/string'

export type Authorization = {
  token?: Token
  renew?: Token
}

export class Scenario {
  public readonly BASIC_AUTHORIZATION = encode(`${process.env.USER}:${process.env.PASS}`)

  public readonly authorization: Authorization = {}

  constructor(private readonly application: NestFastifyApplication) {}

  build = {
    auth: {
      auth: async () => {
        const { json } = await this.application.inject().post('/auth').body({ phone: '+5599999999999' }).end()

        return json<AuthResponse>()
      },
      key: async () => {
        const { key } = await this.build.auth.auth()

        const { json } = await this.application.inject().post('/auth/key').headers({ Key: key }).end()

        return json<TokenResponse>()
      }
    },
    breed: {
      list: async () => {
        const { json } = await this.application.inject().get('/breed').query({ kind: Kind.DOG }).end()

        return json<BreedResponse[]>()
      }
    },
    configuration: {
      breed: async () => {
        const { json } = await this.application
          .inject()
          .post('/configuration/breed')
          .headers({ Authorization: `Basic ${this.BASIC_AUTHORIZATION}` })
          .end()

        return json<BreedResponse[]>()
      },
      location: async () => {
        const { json } = await this.application
          .inject()
          .post('/configuration/location')
          .headers({ Authorization: `Basic ${this.BASIC_AUTHORIZATION}` })
          .end()

        return json<LocationResponse[]>()
      }
    },
    fav: {
      add: async () => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const { id: post } = await this.build.post.create()

        const { json } = await this.application
          .inject()
          .post(`/user/fav/${post}`)
          .headers({ Authorization: `Bearer ${hash}` })
          .end()

        return json<FavResponse>()
      }
    },
    location: {
      search: async () => {
        const { json } = await this.application.inject().get('/location').query({ search: 'recife' }).end()

        return json<LocationResponse[]>()
      }
    },
    pet: {
      create: async () => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const list = await this.build.breed.list()

        const { id: breed } = list.find((e) => e.name === 'Buldogue Inglês') ?? { id: null }

        const { json } = await this.application
          .inject()
          .post('/pet')
          .headers({ Authorization: `Bearer ${hash}` })
          .body({
            name: 'Oreo',
            size: Size.MEDIUM,
            gender: Gender.MALE,
            breed: breed
          })
          .end()

        return json<PetResponse>()
      }
    },
    post: {
      create: async () => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const { id: pet } = await this.build.pet.create()

        const { json } = await this.application
          .inject()
          .post('/post')
          .headers({ Authorization: `Bearer ${hash}` })
          .body({
            image: ['image.jpg'],
            pet: pet,
            publish: true
          })
          .end()

        return json<PostResponse>()
      }
    },
    user: {
      save: async () => {
        const { token: { hash } = { hash: '' } } = this.authorization

        const [{ id: location }] = await this.build.location.search()

        const { json } = await this.application
          .inject()
          .put('/user')
          .headers({ Authorization: `Bearer ${hash}` })
          .body({
            name: 'Name',
            contact: {
              mail: 'mail@example.com',
              phone: '+5599999999999',
              social: 'https://example.com/name'
            },
            location: location
          })
          .end()

        return json<UserResponse>()
      }
    }
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

    const response = json<TokenResponse>()

    this.authorization.token = response.token
    this.authorization.renew = response.renew
  }

  async breed() {
    await this.build.configuration.breed()
  }

  async fav() {
    await this.authenticate()

    await this.build.configuration.breed()
    await this.build.configuration.location()

    await this.build.user.save()
  }

  async location() {
    await this.build.configuration.location()
  }

  async pet() {
    await this.authenticate()

    await this.build.configuration.breed()
  }

  async post() {
    await this.authenticate()

    await this.build.configuration.breed()
    await this.build.configuration.location()

    await this.build.user.save()
  }

  async user() {
    await this.authenticate()

    await this.build.configuration.location()
  }
}
