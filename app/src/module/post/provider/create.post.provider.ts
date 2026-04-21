import { Injectable } from '@nestjs/common'

import { Types } from 'mongoose'

import { PermissionProvider } from '@/module/permission/provider'

import { CreatePostRequest } from '../post.request'
import { PostResponse } from '../post.response'
import { PostRepository } from '../repository/post.repository'

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PostRepository
  ) {}

  private build(request: CreatePostRequest, param: { [key: string]: unknown }) {
    const { image, pet, location, publish } = request

    return Object.assign(
      {
        image,
        pet: new Types.ObjectId(pet),
        location: new Types.ObjectId(location),
        publish
      },
      param
    )
  }

  async run(request: CreatePostRequest, current: string): Promise<PostResponse> {
    const { organization } = request

    if (organization) {
      const permission = await this.provider.organization.run(current, organization)

      if (permission) {
        const post = await this.repository.create(
          this.build(request, { organization: new Types.ObjectId(organization) })
        )

        return new PostResponse(post)
      }
    }

    const post = await this.repository.create(this.build(request, { user: new Types.ObjectId(current) }))

    return new PostResponse(post)
  }
}
