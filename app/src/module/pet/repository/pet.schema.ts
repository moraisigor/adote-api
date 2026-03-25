import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Types, type HydratedDocument } from 'mongoose'

import type { BreedDocument } from '@/module/breed/repository/breed.schema'
import type { OrganizationDocument } from '@/module/organization/repository/organization.schema'
import type { UserDocument } from '@/module/user/repository/user.schema'

import { Gender } from '../type/gender'
import { Size } from '../type/size'

export type PetDocument = HydratedDocument<Pet>

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'Pet'
})
export class Pet {
  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, enum: Size, required: true })
  size: Size

  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender

  @Prop({ type: Types.ObjectId, ref: 'Breed', required: true })
  breed: BreedDocument

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: UserDocument

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organization?: OrganizationDocument
}

export const PetSchema = SchemaFactory.createForClass(Pet)
