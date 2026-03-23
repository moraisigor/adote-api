import { BadRequestException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { UserRepository } from '../repository/user.repository'
import { UserResponse } from '../user.response'

export class SaveImageProvider {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string, image: string): Promise<UserResponse> {
    const map: { [key: string]: unknown } = {
      image: image
    }

    const user = await this.repository.save(new Types.ObjectId(id), map, { new: true })

    if (isNil(user)) {
      throw new BadRequestException()
    }

    return new UserResponse(user)
  }
}
