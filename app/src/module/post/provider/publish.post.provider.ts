import { BadRequestException, NotFoundException } from '@nestjs/common'

import { isNil } from 'lodash'
import { Types } from 'mongoose'

import type { PermissionProvider } from '@/module/permission/provider'

import { Permission } from '@/helper/permission'

import { PublishPostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

export class PublishPostProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PostRepository
  ) {}

  async run(id: string, publish: boolean, current: string): Promise<PublishPostResponse> {
    const post = await this.repository.find({ _id: id })

    if (isNil(post)) {
      throw new BadRequestException()
    }

    const { user, organization } = post

    const permission = await new Permission(current, this.provider).run(
      user as Types.ObjectId,
      organization as Types.ObjectId
    )

    if (permission) {
      const result = await this.repository.save(
        new Types.ObjectId(id),
        { publish },
        { returnDocument: 'after' }
      )

      if (isNil(result)) {
        throw new BadRequestException()
      }

      return new PublishPostResponse(post)
    }

    throw new BadRequestException()
  }
}
