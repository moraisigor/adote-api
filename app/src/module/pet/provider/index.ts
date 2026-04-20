import { Injectable } from '@nestjs/common'

import { PermissionProvider } from '@/module/permission/provider'

import { CreatePetProvider } from './create.pet.provider'
import { GetPetProvider } from './get.pet.provider'
import { ListPetProvider } from './list.pet.provider'
import { RemovePetProvider } from './remove.pet.provider'
import { SavePetProvider } from './save.pet.provider'

import { PetRepository } from '../repository/pet.repository'

@Injectable()
export class PetProvider {
  readonly get: GetPetProvider
  readonly list: ListPetProvider
  readonly create: CreatePetProvider
  readonly save: SavePetProvider
  readonly remove: RemovePetProvider

  constructor(
    private readonly permission: PermissionProvider,
    private readonly repository: PetRepository
  ) {
    this.get = new GetPetProvider(this.permission, this.repository)
    this.list = new ListPetProvider(this.permission, this.repository)
    this.create = new CreatePetProvider(this.permission, this.repository)
    this.save = new SavePetProvider(this.permission, this.repository)
    this.remove = new RemovePetProvider(this.permission, this.repository)
  }
}
