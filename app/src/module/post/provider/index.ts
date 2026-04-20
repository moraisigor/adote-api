import { Injectable } from '@nestjs/common'

import { PermissionProvider } from '@/module/permission/provider'

import { CreatePostProvider } from './create.post.provider'
import { GetPostProvider } from './get.post.provider'
import { ListPostProvider } from './list.post.provider'
import { PublishPostProvider } from './publish.post.provider'
import { RemovePostProvider } from './remove.post.provider'
import { SavePostProvider } from './save.post.provider'

import { PostRepository } from '../repository/post.repository'

@Injectable()
export class PostProvider {
  readonly get: GetPostProvider
  readonly list: ListPostProvider
  readonly create: CreatePostProvider
  readonly save: SavePostProvider
  readonly publish: PublishPostProvider
  readonly remove: RemovePostProvider

  constructor(
    private readonly provider: PermissionProvider,
    private readonly repository: PostRepository
  ) {
    this.get = new GetPostProvider(this.repository)
    this.list = new ListPostProvider(this.repository)
    this.create = new CreatePostProvider(this.provider, this.repository)
    this.save = new SavePostProvider(this.provider, this.repository)
    this.publish = new PublishPostProvider(this.provider, this.repository)
    this.remove = new RemovePostProvider(this.provider, this.repository)
  }
}
