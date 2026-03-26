import { NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

export class GetPetProvider {
  constructor(private readonly repository: PetRepository) {}

  async run(id: string): Promise<PetResponse> {
    const pet = await this.repository.find({ _id: id })

    if (isNil(pet)) {
      throw new NotFoundException()
    }

    return new PetResponse(pet)
  }
}
