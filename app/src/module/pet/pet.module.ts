import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PetController } from './pet.controller'
import { PetProvider } from './provider'
import { PetRepository } from './repository/pet.repository'
import { Pet, PetSchema } from './repository/pet.schema'

import { PermissionModule } from '../permission/permission.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]), PermissionModule],
  providers: [PetProvider, PetRepository],
  controllers: [PetController]
})
export class PetModule {}
