import { Injectable } from '@nestjs/common'

import { CreateOrganizationProvider } from './create.organization.provider'
import { GetOrganizationProvider } from './get.organization.provider'
import { ListOrganizationProvider } from './list.organization.provider'
import { RemoveOrganizationProvider } from './remove.organization.provider'
import { SaveOrganizationProvider } from './save.organization.provider'

import { OrganizationRepository } from '../repository/organization.repository'

@Injectable()
export class OrganizationProvider {
  readonly get: GetOrganizationProvider
  readonly list: ListOrganizationProvider
  readonly create: CreateOrganizationProvider
  readonly save: SaveOrganizationProvider
  readonly remove: RemoveOrganizationProvider

  constructor(private readonly repository: OrganizationRepository) {
    this.get = new GetOrganizationProvider(this.repository)
    this.list = new ListOrganizationProvider(this.repository)
    this.create = new CreateOrganizationProvider(this.repository)
    this.save = new SaveOrganizationProvider(this.repository)
    this.remove = new RemoveOrganizationProvider(this.repository)
  }
}
