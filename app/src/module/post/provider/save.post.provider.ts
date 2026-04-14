import { NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import { SavePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

export class SavePostProvider {
  constructor(private readonly repository: PostRepository) {}

  async run(id: string, request: SavePostRequest): Promise<PostResponse> {
    const { image, location, publish } = request

    const map: { [key: string]: unknown } = {
      image,
      location: new Types.ObjectId(location),
      publish
    }

    const post = await this.repository.save(new Types.ObjectId(id), map, { returnDocument: 'after' })

    if (isNil(post)) {
      throw new NotFoundException()
    }

    return new PostResponse(post)
  }
}
