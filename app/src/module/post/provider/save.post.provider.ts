import { NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import type { SavePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

export class SavePostProvider {
  constructor(private readonly repository: PostRepository) {}

  private build(request: SavePostRequest, user: string) {
    const { image, organization, publish } = request

    const post = {
      image,
      publish
    }

    if (organization) {
      return Object.assign(post, { organization: new Types.ObjectId(organization) })
    }

    return Object.assign(post, { user: new Types.ObjectId(user) })
  }

  async run(id: string, request: SavePostRequest, user: string): Promise<PostResponse> {
    const post = await this.repository.save(new Types.ObjectId(id), this.build(request, user), { new: true })

    if (isNil(post)) {
      throw new NotFoundException()
    }

    return new PostResponse(post)
  }
}
