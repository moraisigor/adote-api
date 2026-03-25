import type { PostDocument } from './repository/post.schema'

import type { LocationDocument } from '../location/repository/location.schema'
import type { Contact, OrganizationDocument } from '../organization/repository/organization.schema'
import type { PetDocument } from '../pet/repository/pet.schema'
import type { UserDocument } from '../user/repository/user.schema'

class PetResponse {
  readonly id: string

  constructor(pet: PetDocument) {
    this.id = pet.id
  }
}

class UserResponse {
  readonly id: string
  readonly name?: string
  readonly image?: string
  readonly contact?: ContactResponse
  readonly location?: LocationResponse

  constructor(user: UserDocument) {
    const { contact, location } = user

    this.id = user.id
    this.name = user.name
    this.image = user.image

    if (contact) {
      const { mail, phone, social } = contact

      this.contact = new ContactResponse(mail, phone, social)
    }

    if (location) {
      this.location = new LocationResponse(location as LocationDocument)
    }
  }
}

class OrganizationResponse {
  readonly id: string
  readonly name: string
  readonly image?: string
  readonly contact?: ContactResponse
  readonly location?: LocationResponse

  constructor(organization: OrganizationDocument) {
    const { contact, location } = organization

    this.id = organization.id
    this.name = organization.name
    this.image = organization.image

    if (contact) {
      const { mail, phone, social } = contact

      this.contact = new ContactResponse(mail, phone, social)
    }

    if (location) {
      this.location = new LocationResponse(location as LocationDocument)
    }
  }
}

class ContactResponse {
  readonly mail?: string
  readonly phone?: string
  readonly social?: string

  constructor(mail?: string, phone?: string, social?: string) {
    this.mail = mail
    this.phone = phone
    this.social = social
  }
}

class LocationResponse {
  readonly id: string
  readonly city: string
  readonly state: string

  constructor(location: LocationDocument) {
    this.id = location.id
    this.city = location.city
    this.state = location.state
  }
}

export class PostResponse {
  readonly id: string
  readonly image: string[]
  readonly pet: PetResponse
  readonly user?: UserResponse
  readonly organization?: OrganizationResponse

  constructor(post: PostDocument) {
    const { pet, user, organization } = post

    this.id = post.id
    this.image = post.image
    this.pet = new PetResponse(pet as PetDocument)

    if (user) {
      this.user = new UserResponse(user as UserDocument)
    }

    if (organization) {
      this.organization = new OrganizationResponse(organization as OrganizationDocument)
    }
  }
}
