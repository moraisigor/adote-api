import { LocationRepository } from '@/module/location/repository/location.repository'

import location from '../location.json'

export class SetLocationProvider {
  constructor(private readonly repository: LocationRepository) {}

  async run(): Promise<void> {
    await this.repository.remove()

    await this.repository.create(location)
  }
}
