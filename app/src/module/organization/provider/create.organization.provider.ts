import { Types } from 'mongoose'

import { CreateOrganizationRequest } from '../organization.request'
import { OrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'
import { OrganizationRole } from '../type/organization.role'

export class CreateOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(request: CreateOrganizationRequest, user: string): Promise<OrganizationResponse> {
    const { name } = request

    const organization = await this.repository.create({
      name,
      member: [
        {
          user: new Types.ObjectId(user),
          role: OrganizationRole.MANAGER
        }
      ]
    })

    return new OrganizationResponse(organization)
  }
}
