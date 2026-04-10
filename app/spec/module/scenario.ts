import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import { encode } from '@/helper/string'

export class Scenario {
  public readonly BASIC = encode(`${process.env.USER}:${process.env.PASS}`)

  constructor(private readonly application: NestFastifyApplication) {}

  async breed() {
    await this.application
      .inject()
      .post('/configuration/breed')
      .headers({ Authorization: `Basic ${this.BASIC}` })
      .end()
  }
}
