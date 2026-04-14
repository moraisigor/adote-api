import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common'

import type { User } from '@/type/token'

import { Permission } from '@/decorator/permission.decorator'
import { Public } from '@/decorator/public.decorator'
import { UserCurrent } from '@/decorator/user.current.decorator'

import { UserProvider } from './provider'
import { Role } from './type/role'
import { GetUserParam, SaveImageRequest, SaveUserRequest } from './user.request'
import { UserResponse } from './user.response'

@Controller()
export class UserController {
  constructor(private readonly provider: UserProvider) {}

  @Get()
  @Permission([Role.MANAGER])
  list(): Promise<UserResponse[]> {
    return this.provider.list.run()
  }

  @Get(':id')
  @Public()
  get(@Param() param: GetUserParam): Promise<UserResponse> {
    const { id } = param

    return this.provider.get.run(id)
  }

  @Get('current')
  current(@UserCurrent() user: User): Promise<UserResponse> {
    const { id } = user

    return this.provider.get.run(id)
  }

  @Put()
  save(@Body() request: SaveUserRequest, @UserCurrent() user: User): Promise<UserResponse> {
    const { id } = user

    return this.provider.save.run(id, request)
  }

  @Put('image')
  image(@Body() request: SaveImageRequest, @UserCurrent() user: User): Promise<UserResponse> {
    const { id } = user
    const { image } = request

    return this.provider.image.run(id, image)
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@UserCurrent() user: User): Promise<void> {
    const { id } = user

    return this.provider.remove.run(id)
  }
}
