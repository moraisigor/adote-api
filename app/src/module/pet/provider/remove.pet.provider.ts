import { NotFoundException } from '@nestjs/common'

import { RemovePetResponse } from '../pet.response'
import type { PetRepository } from '../repository/pet.repository'

export class RemovePetProvider {
  private readonly empty = 0

  constructor(private readonly repository: PetRepository) {}

  async run(id: string, user: string): Promise<RemovePetResponse> {
    const amount = await this.repository.remove({ _id: id })

    if (this.empty === amount) {
      throw new NotFoundException()
    }

    return new RemovePetResponse(id)
  }
}
