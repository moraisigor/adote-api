import { BadRequestException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { SavePetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

export class SavePetProvider {
  constructor(private readonly repository: PetRepository) {}

  private build(request: SavePetRequest, user: string) {
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

  async run(id: string, request: SavePetRequest, user: string): Promise<PetResponse> {
    const pet = await this.repository.save(new Types.ObjectId(id), this.build(request, user), { new: true })

    if (isNil(pet)) {
      throw new BadRequestException()
    }

    return new PetResponse(pet)
  }
}
