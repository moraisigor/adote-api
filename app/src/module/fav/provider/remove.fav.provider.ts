import { BadRequestException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { FavResponse } from '../fav.response'
import { FavRepository } from '../repository/fav.repository'

export class RemoveFavProvider {
  constructor(private readonly repository: FavRepository) {}

  async run(post: string, user: string): Promise<FavResponse> {
    const result = await this.repository.remove(new Types.ObjectId(post), new Types.ObjectId(user), {
      returnDocument: 'after'
    })

    if (isNil(result)) {
      throw new BadRequestException()
    }

    return new FavResponse(post)
  }
}
