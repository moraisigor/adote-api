import { NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { PublishPostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

export class PublishPostProvider {
  constructor(private readonly repository: PostRepository) {}

  async run(id: string, publish: boolean, user: string): Promise<PublishPostResponse> {
    const map: { [key: string]: unknown } = {
      publish
    }

    const post = await this.repository.save(new Types.ObjectId(id), map, { returnDocument: 'after' })

    if (isNil(post)) {
      throw new NotFoundException()
    }

    return new PublishPostResponse(post)
  }
}
