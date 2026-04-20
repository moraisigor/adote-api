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
    private readonly provider: PermissionProvider,
    private readonly repository: PetRepository
  ) {
    this.get = new GetPetProvider(this.provider, this.repository)
    this.list = new ListPetProvider(this.provider, this.repository)
    this.create = new CreatePetProvider(this.provider, this.repository)
    this.save = new SavePetProvider(this.provider, this.repository)
    this.remove = new RemovePetProvider(this.provider, this.repository)
  }
}
