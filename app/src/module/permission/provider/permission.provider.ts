import { Injectable } from '@nestjs/common'

import { eq } from 'lodash'
import { Types } from 'mongoose'

import { OrganizationRepository } from '@/module/organization/repository/organization.repository'
import { OrganizationRole } from '@/module/organization/type/organization.role'

@Injectable()
export class PermissionProvider {
  constructor(private readonly repository: OrganizationRepository) {}

  async run(
    current: string,
    user?: string,
    organization?: string,
    permission: OrganizationRole[] = [OrganizationRole.MEMBER, OrganizationRole.MANAGER]
  ) {
    if (eq(user, current)) {
      return true
    }

    return await this.repository.exists({
      '_id': organization,
      'member.user': new Types.ObjectId(current),
      'member.role': { $in: permission }
    })
  }
}
