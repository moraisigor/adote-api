import { Types } from 'mongoose'

import type { CreatePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

export class CreatePostProvider {
  constructor(private readonly repository: PostRepository) {}

  private build(request: CreatePostRequest, user: string) {
    const { image, pet, organization, publish } = request

    const post = {
      image,
      pet: new Types.ObjectId(pet),
      publish
    }

    if (organization) {
      return Object.assign(post, { organization: new Types.ObjectId(organization) })
    }

    return Object.assign(post, { user: new Types.ObjectId(user) })
  }

  async run(request: CreatePostRequest, user: string): Promise<PostResponse> {
    const post = await this.repository.create(this.build(request, user))

    return new PostResponse(post)
  }
}
