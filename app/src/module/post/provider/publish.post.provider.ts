import { Types } from 'mongoose'

import { PostRepository } from '../repository/post.repository'

export class PublishPostProvider {
  constructor(private readonly repository: PostRepository) {}

  async run(id: string, publish: boolean, user: string): Promise<void> {
    const map: { [key: string]: unknown } = {
      publish
    }

    await this.repository.save(new Types.ObjectId(id), map, { new: true })
  }
}
