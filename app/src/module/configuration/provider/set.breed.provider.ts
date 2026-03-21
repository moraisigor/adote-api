import { BreedRepository } from '@/module/breed/repository/breed.repository'
import { Kind } from '@/module/breed/type/kind.enum'

import cat from '../cat.json'
import dog from '../dog.json'

export class SetBreedProvider {
  constructor(private readonly repository: BreedRepository) {}

  async run(): Promise<void> {
    await this.repository.remove()

    await this.repository.create(
      cat.map((name) => {
        return {
          name,
          kind: Kind.CAT
        }
      })
    )

    await this.repository.create(
      dog.map((name) => {
        return {
          name,
          kind: Kind.DOG
        }
      })
    )
  }
}
