import { NotFoundException } from '@nestjs/common'

import { RemovePostResponse } from '../post.response'
import type { PostRepository } from '../repository/post.repository'

export class RemovePostProvider {
  private readonly empty = 0

  constructor(private readonly repository: PostRepository) {}

  async run(id: string, user: string): Promise<RemovePostResponse> {
    const amount = await this.repository.remove({ _id: id })

    if (this.empty === amount) {
      throw new NotFoundException()
    }

    return new RemovePostResponse(id)
  }
}
