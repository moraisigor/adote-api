import { Injectable } from '@nestjs/common'

import { LocationResponse } from '../location.response'
import { LocationRepository } from '../repository/location.repository'

@Injectable()
export class SearchLocationProvider {
  constructor(private readonly repository: LocationRepository) {}

  async run(search: string): Promise<LocationResponse[]> {
    const list = await this.repository.list({
      city: {
        $regex: search,
        $options: 'i'
      }
    })

    return list.map((e) => new LocationResponse(e))
  }
}
