import type { ListPostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

export class ListPostProvider {
  constructor(private readonly repository: PostRepository) {}

  async run(request: ListPostRequest): Promise<PostResponse[]> {
    const { page, amount, location } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount, { location })

    return list.map((e) => new PostResponse(e))
  }
}
