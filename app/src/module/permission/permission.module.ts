import { Module } from '@nestjs/common'

import { PermissionProvider } from './provider/permission.provider'

import { OrganizationModule } from '../organization/organization.module'

@Module({
  imports: [OrganizationModule],
  exports: [PermissionProvider],
  providers: [PermissionProvider]
})
export class PermissionModule {}
