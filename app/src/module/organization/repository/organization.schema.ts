import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Types, type HydratedDocument } from 'mongoose'

import type { PetDocument } from '@/module/pet/repository/pet.schema'
import type { PostDocument } from '@/module/post/repository/post.schema'

export type OrganizationDocument = HydratedDocument<Organization>

export class Contact {
  @Prop({ type: String })
  mail?: string

  @Prop({ type: String })
  phone?: string
}

@Schema({
  id: true,
  timestamps: { createdAt: 'create', updatedAt: 'update' },
  collection: 'Organization'
})
export class Organization {
  @Prop({ type: String, unique: true, required: true })
  name: string

  @Prop({ type: String })
  image?: string

  @Prop({ type: String, unique: true })
  document?: string

  @Prop({ type: Contact })
  contact?: Contact

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Pet' }], default: [] })
  pet?: PetDocument[] = []

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }], default: [] })
  post?: PostDocument[] = []
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization)
