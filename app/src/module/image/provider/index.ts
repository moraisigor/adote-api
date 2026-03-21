import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { RemoveImageProvider } from './remove.image.provider'
import { SaveImageProvider } from './save.image.provider'

@Injectable()
export class ImageProvider {
  readonly save: SaveImageProvider
  readonly remove: RemoveImageProvider

  constructor(private readonly config: ConfigService) {
    this.save = new SaveImageProvider(this.config)
    this.remove = new RemoveImageProvider(this.config)
  }
}
