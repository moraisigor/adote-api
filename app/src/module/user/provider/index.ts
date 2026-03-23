import { Injectable } from '@nestjs/common'

import { ImageProvider } from '@/module/image/provider'

import { GetUserProvider } from './get.user.provider'
import { ListUserProvider } from './list.user.provider'
import { RemoveUserProvider } from './remove.user.provider'
import { SaveImageProvider } from './save.image.provider'
import { SaveUserProvider } from './save.user.provider'

import { UserRepository } from '../repository/user.repository'

@Injectable()
export class UserProvider {
  readonly get: GetUserProvider
  readonly list: ListUserProvider
  readonly save: SaveUserProvider
  readonly image: SaveImageProvider
  readonly remove: RemoveUserProvider

  constructor(private readonly repository: UserRepository) {
    this.get = new GetUserProvider(this.repository)
    this.list = new ListUserProvider(this.repository)
    this.save = new SaveUserProvider(this.repository)
    this.image = new SaveImageProvider(this.repository)
    this.remove = new RemoveUserProvider(this.repository)
  }
}
