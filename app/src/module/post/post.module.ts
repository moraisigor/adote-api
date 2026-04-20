import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PostController } from './post.controller'
import { PostProvider } from './provider'
import { PostRepository } from './repository/post.repository'
import { Post, PostSchema } from './repository/post.schema'

import { PermissionModule } from '../permission/permission.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), PermissionModule],
  providers: [PostProvider, PostRepository],
  controllers: [PostController]
})
export class PostModule {}
