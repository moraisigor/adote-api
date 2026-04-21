import { Injectable } from '@nestjs/common'

import { OrganizationRepository } from '@/module/organization/repository/organization.repository'

import { GetUserProvider } from './get.user.provider'
import { ListOrganizationProvider } from './list.organization.provider'
import { ListUserProvider } from './list.user.provider'
import { RemoveUserProvider } from './remove.user.provider'
import { SaveImageProvider } from './save.image.provider'
import { SaveUserProvider } from './save.user.provider'

import { UserRepository } from '../repository/user.repository'

@Injectable()
export class UserProvider {
  readonly get: GetUserProvider
  readonly list: ListUserProvider
  readonly organization: ListOrganizationProvider
  readonly save: SaveUserProvider
  readonly image: SaveImageProvider
  readonly remove: RemoveUserProvider

  constructor(
    private readonly _user: UserRepository,
    private readonly _organization: OrganizationRepository
  ) {
    this.get = new GetUserProvider(this._user)
    this.list = new ListUserProvider(this._user)
    this.organization = new ListOrganizationProvider(this._organization)
    this.save = new SaveUserProvider(this._user)
    this.image = new SaveImageProvider(this._user)
    this.remove = new RemoveUserProvider(this._user)
  }
}
