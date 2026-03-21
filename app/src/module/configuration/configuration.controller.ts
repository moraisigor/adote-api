import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { Permission } from '@/decorator/permission.decorator'

import { Role } from '@/module/user/type/role'

import { ConfigurationProvider } from './provider'

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly provider: ConfigurationProvider) {}

  @Post('/user')
  @HttpCode(HttpStatus.OK)
  @Permission([Role.MANAGER])
  user(): Promise<void> {
    return this.provider.user.run()
  }

  @Post('/breed')
  @HttpCode(HttpStatus.OK)
  @Permission([Role.MANAGER])
  breed(): Promise<void> {
    return this.provider.breed.run()
  }

  @Post('/location')
  @HttpCode(HttpStatus.OK)
  @Permission([Role.MANAGER])
  location(): Promise<void> {
    return this.provider.location.run()
  }
}
