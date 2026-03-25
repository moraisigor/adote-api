import { NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import type { SavePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

export class SavePostProvider {
  constructor(private readonly repository: PostRepository) {}

  private build(request: SavePostRequest, user: string): { [key: string]: unknown } {
    const { image, organization, publish } = request

    if (organization) {
      return {
        image,
        organization: new Types.ObjectId(organization),
        publish
      }
    }

    return {
      image,
      user: new Types.ObjectId(user),
      publish
    }
  }

  async run(id: string, request: SavePostRequest, user: string): Promise<PostResponse> {
    const post = await this.repository.save(new Types.ObjectId(id), this.build(request, user), { new: true })

    if (isNil(post)) {
      throw new NotFoundException()
    }

    return new PostResponse(post)
  }
}
