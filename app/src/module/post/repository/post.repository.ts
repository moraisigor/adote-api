import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model, ProjectionType, QueryFilter, QueryOptions, Types } from 'mongoose'

import type { OrganizationDocument } from '@/module/organization/repository/organization.schema'
import type { PetDocument } from '@/module/pet/repository/pet.schema'
import type { UserDocument } from '@/module/user/repository/user.schema'

import { Post, type PostDocument } from './post.schema'

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private readonly model: Model<Post>) {}

  list(
    skip: number,
    limit: number,
    query?: QueryFilter<Post>,
    projection?: ProjectionType<Post>,
    options?: QueryOptions<Post>
  ): Promise<PostDocument[]> {
    return this.model
      .find(query)
      .projection(projection)
      .options(options)
      .skip(skip)
      .limit(limit)
      .populate([
        { path: 'pet' },
        { path: 'user', populate: { path: 'location' } },
        { path: 'organization', populate: { path: 'location' } }
      ])
      .exec()
  }

  find(
    query: QueryFilter<Post>,
    projection?: ProjectionType<Post>,
    options?: QueryOptions<Post>
  ): Promise<PostDocument | null> {
    return this.model
      .findOne(query, projection, options)
      .populate([
        { path: 'pet' },
        { path: 'user', populate: { path: 'location' } },
        { path: 'organization', populate: { path: 'location' } }
      ])
      .exec()
  }

  // prettier-ignore
  create(post: {
    image: string[]
    pet: PetDocument
    user?: UserDocument
    organization?: OrganizationDocument
    publish: boolean
  }): Promise<PostDocument> {
    return this.model
      .create(post)
      .then((model) =>
        model.populate([
          { path: 'pet' },
          { path: 'user', populate: { path: 'location' } },
          { path: 'organization', populate: { path: 'location' } }
        ])
      )
  }

  save(
    id: Types.ObjectId,
    post: { [key: string]: unknown },
    options?: QueryOptions<Post>
  ): Promise<PostDocument | null> {
    return this.model
      .findByIdAndUpdate(id, post, options)
      .populate([
        { path: 'pet' },
        { path: 'user', populate: { path: 'location' } },
        { path: 'organization', populate: { path: 'location' } }
      ])
      .exec()
  }

  async remove(query?: QueryFilter<Post>): Promise<number> {
    const { deletedCount: amount } = await this.model.deleteOne(query).exec()

    return amount
  }
}
