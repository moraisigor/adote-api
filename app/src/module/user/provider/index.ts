import { Injectable } from '@nestjs/common'

import { GetCurrentProvider } from './get.current.provider'
import { GetUserProvider } from './get.user.provider'
import { ListOrganizationProvider } from './list.organization.provider'
import { ListUserProvider } from './list.user.provider'
import { RemoveUserProvider } from './remove.user.provider'
import { SaveImageProvider } from './save.image.provider'
import { SaveUserProvider } from './save.user.provider'

@Injectable()
export class UserProvider {
  constructor(
    readonly get: GetUserProvider,
    readonly current: GetCurrentProvider,
    readonly list: ListUserProvider,
    readonly organization: ListOrganizationProvider,
    readonly save: SaveUserProvider,
    readonly image: SaveImageProvider,
    readonly remove: RemoveUserProvider
  ) {}
}
