import { OrganizationResponse } from '../organization.response'
import { OrganizationRepository } from '../repository/organization.repository'

export class ListOrganizationProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(): Promise<OrganizationResponse[]> {
    const list = await this.repository.list()

    return list.map((e) => new OrganizationResponse(e))
  }
}
