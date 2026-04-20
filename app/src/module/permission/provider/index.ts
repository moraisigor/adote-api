import { Injectable } from '@nestjs/common'

import { OrganizationRepository } from '@/module/organization/repository/organization.repository'

import { OrganizationPermissionProvider } from './organization.permission.provider'

@Injectable()
export class PermissionProvider {
  readonly organization: OrganizationPermissionProvider

  constructor(private readonly repository: OrganizationRepository) {
    this.organization = new OrganizationPermissionProvider(this.repository)
  }
}
