import { ConfigService } from '@nestjs/config'

export class SendMessageProvider {
  constructor(private readonly config: ConfigService) {}

  run(phone: string, message: string): Promise<void> {
    return Promise.resolve()
  }
}
