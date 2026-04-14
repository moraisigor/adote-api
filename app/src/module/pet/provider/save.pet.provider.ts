import { BadRequestException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { SavePetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

export class SavePetProvider {
  constructor(private readonly repository: PetRepository) {}

  async run(id: string, request: SavePetRequest): Promise<PetResponse> {
    const { name, size, gender, breed } = request

    const map: { [key: string]: unknown } = {
      name,
      size,
      gender,
      breed: new Types.ObjectId(breed)
    }

    const pet = await this.repository.save(new Types.ObjectId(id), map, { returnDocument: 'after' })

    if (isNil(pet)) {
      throw new BadRequestException()
    }

    return new PetResponse(pet)
  }
}
