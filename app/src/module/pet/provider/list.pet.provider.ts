import { Types } from 'mongoose'

import { ListPetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

export class ListPetProvider {
  constructor(private readonly repository: PetRepository) {}

  private query(request: ListPetRequest, user: string) {
    const { organization } = request

    if (organization) {
      return {
        organization: new Types.ObjectId(organization)
      }
    }

    return {
      user: new Types.ObjectId(user)
    }
  }

  async run(request: ListPetRequest, user: string): Promise<PetResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount, this.query(request, user))

    return list.map((e) => new PetResponse(e))
  }
}
