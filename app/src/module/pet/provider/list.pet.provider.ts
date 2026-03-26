import type { ListPetRequest } from '../pet.request'
import { PetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

export class ListPetProvider {
  constructor(private readonly repository: PetRepository) {}

  async run(request: ListPetRequest): Promise<PetResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount)

    return list.map((e) => new PetResponse(e))
  }
}
