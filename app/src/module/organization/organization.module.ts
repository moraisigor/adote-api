import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OrganizationController } from './organization.controller'
import { OrganizationProvider } from './provider'
import { OrganizationRepository } from './repository/organization.repository'
import { Organization, OrganizationSchema } from './repository/organization.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }])],
  exports: [OrganizationRepository],
  providers: [OrganizationProvider, OrganizationRepository],
  controllers: [OrganizationController]
})
export class OrganizationModule {}
