import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { PostResponse } from '@/module/post/post.response'
import { PostRepository } from '@/module/post/repository/post.repository'

import { ListPostRequest } from '../user.request'

@Injectable()
export class ListPostProvider {
  constructor(private readonly repository: PostRepository) {}

  async run(request: ListPostRequest, user: string): Promise<PostResponse[]> {
    const { page, amount } = request

    const skip = (page - 1) * amount

    const list = await this.repository.list(skip, amount, {
      user: new Types.ObjectId(user)
    })

    return list.map((e) => new PostResponse(e))
  }
}
