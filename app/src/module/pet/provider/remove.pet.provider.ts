import { NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { PermissionProvider } from '@/module/permission/provider/permission.provider'

import { RemovePetResponse } from '../pet.response'
import { PetRepository } from '../repository/pet.repository'

export class RemovePetProvider {
  constructor(
    private readonly permission: PermissionProvider,
    private readonly repository: PetRepository
  ) {}

  async run(id: string, current: string): Promise<RemovePetResponse> {
    const pet = await this.repository.find({ _id: id })

    if (isNil(pet)) {
      throw new NotFoundException()
    }

    const { user, organization } = pet

    const permission = await this.permission.run(current, String(user), String(organization))

    if (permission) {
      await this.repository.remove({ _id: id })

      return new RemovePetResponse(id)
    }

    throw new NotFoundException()
  }
}
