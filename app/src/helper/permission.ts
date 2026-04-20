import { eq } from 'lodash'

import { OrganizationRole } from '@/module/organization/type/organization.role'
import { PermissionProvider } from '@/module/permission/provider'

export const permission = async (
  current: string,
  request: {
    user?: string
    organization?: string
    permission?: OrganizationRole[]
  },
  provider: PermissionProvider
): Promise<boolean> => {
  const { user, organization, permission } = request

  if (eq(user, current)) {
    return true
  }

  if (organization) {
    return await provider.organization.run(current, organization, permission)
  }

  return false
}
