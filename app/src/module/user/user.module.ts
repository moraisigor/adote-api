import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserProvider } from './provider'
import { UserRepository } from './repository/user.repository'
import { User, UserSchema } from './repository/user.schema'
import { UserController } from './user.controller'

import { ImageModule } from '../image/image.module'
import { OrganizationModule } from '../organization/organization.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ImageModule,
    OrganizationModule
  ],
  exports: [UserRepository],
  providers: [UserProvider, UserRepository],
  controllers: [UserController]
})
export class UserModule {}
