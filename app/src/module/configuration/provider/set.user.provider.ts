import { UserRepository } from '@/module/user/repository/user.repository'
import { Role } from '@/module/user/type/role'

import user from '../user.json'

export class SetUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(): Promise<void> {
    await this.repository.remove()

    const { name, phone } = user

    await this.repository.create({
      name,
      phone,
      contact: {
        phone
      },
      role: Role.MANAGER
    })
  }
}
