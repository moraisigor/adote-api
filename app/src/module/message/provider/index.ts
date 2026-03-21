import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SendMessageProvider } from './send.message.provider'

@Injectable()
export class MessageProvider {
  readonly send: SendMessageProvider

  constructor(private readonly config: ConfigService) {
    this.send = new SendMessageProvider(this.config)
  }
}
