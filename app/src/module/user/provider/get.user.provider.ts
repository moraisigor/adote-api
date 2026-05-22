import { Injectable, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'

import { UserRepository } from '../repository/user.repository'
import { UserCurrentResponse } from '../user.response'

@Injectable()
export class GetUserProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string): Promise<UserCurrentResponse> {
    const user = await this.repository.find({ _id: id })

    if (isNil(user)) {
      throw new NotFoundException()
    }

    return new UserCurrentResponse(user)
  }
}
