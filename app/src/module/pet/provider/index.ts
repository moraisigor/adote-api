import { Injectable } from '@nestjs/common'

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

  constructor(private readonly repository: PetRepository) {
    this.get = new GetPetProvider(this.repository)
    this.list = new ListPetProvider(this.repository)
    this.create = new CreatePetProvider(this.repository)
    this.save = new SavePetProvider(this.repository)
    this.remove = new RemovePetProvider(this.repository)
  }
}
