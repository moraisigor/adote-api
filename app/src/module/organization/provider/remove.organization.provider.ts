import { NotFoundException } from '@nestjs/common'

import { OrganizationRepository } from '../repository/organization.repository'

export class RemoveOrganizationProvider {
  private readonly empty = 0

  constructor(private readonly repository: OrganizationRepository) {}

  async run(id: string): Promise<void> {
    const amount = await this.repository.remove({ _id: id })

    if (this.empty === amount) {
      throw new NotFoundException()
    }
  }
}
