import { Types } from 'mongoose'

import type { CreatePetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

export class CreatePetProvider {
  constructor(private readonly repository: PetRepository) {}

  private build(request: CreatePetRequest, user: string) {
    const { name, size, gender, breed, organization } = request

    const pet = {
      name,
      size,
      gender,
      breed: new Types.ObjectId(breed)
    }

    if (organization) {
      return Object.assign(pet, { organization: new Types.ObjectId(organization) })
    }

    return Object.assign(pet, { user: new Types.ObjectId(user) })
  }

  async run(request: CreatePetRequest, user: string): Promise<PetResponse> {
    const pet = await this.repository.create(this.build(request, user))

    return new PetResponse(pet)
  }
}
