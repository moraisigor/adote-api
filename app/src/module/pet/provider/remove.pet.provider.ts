import { NotFoundException } from '@nestjs/common'

import type { PetRepository } from '../repository/pet.repository'

export class RemovePetProvider {
  private readonly empty = 0

  constructor(private readonly repository: PetRepository) {}

  async run(id: string, user: string): Promise<void> {
    const amount = await this.repository.remove({ _id: id })

    if (this.empty === amount) {
      throw new NotFoundException()
    }
  }
}
