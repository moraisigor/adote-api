import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import type { TokenResponse } from '@/module/auth/auth.response'
import type { Token } from '@/module/auth/type/token'

import { encode } from '@/helper/string'

export type Authorization = {
  token?: Token
  renew?: Token
}

export class Scenario {
  public readonly BASIC_AUTHORIZATION = encode(`${process.env.USER}:${process.env.PASS}`)

  public readonly authorization: Authorization = {}

  constructor(private readonly application: NestFastifyApplication) {}

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
    // load breed list
    await this.application
      .inject()
      .post('/configuration/breed')
      .headers({ Authorization: `Basic ${this.BASIC_AUTHORIZATION}` })
      .end()
  }

  async location() {
    // load location list
    await this.application
      .inject()
      .post('/configuration/location')
      .headers({ Authorization: `Basic ${this.BASIC_AUTHORIZATION}` })
      .end()
  }

  async pet() {
    await this.authenticate()

    // load breed list
    await this.application
      .inject()
      .post('/configuration/breed')
      .headers({ Authorization: `Basic ${this.BASIC_AUTHORIZATION}` })
      .end()
  }
}
