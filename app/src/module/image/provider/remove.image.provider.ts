import { ConfigService } from '@nestjs/config'

export class RemoveImageProvider {
  constructor(private readonly config: ConfigService) {}

  async run() {}
}
