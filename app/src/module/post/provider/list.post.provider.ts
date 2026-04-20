import { Types } from 'mongoose'

import { ListPostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

export class ListPostProvider {
  constructor(private readonly repository: PostRepository) {}

  async run(request: ListPostRequest): Promise<PostResponse[]> {
    const { page, amount, location } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount, {
      publish: true,
      location: { $in: location.map((e) => new Types.ObjectId(e)) }
    })

    return list.map((e) => new PostResponse(e))
  }
}
