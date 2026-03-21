import { Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'

import type { User } from '@/type/token'

import { UserCurrent } from '@/decorator/user.current.decorator'

import { AddFavParam, RemoveFavParam } from './fav.request'
import { FavProvider } from './provider'

@Controller()
export class FavController {
  constructor(private readonly provider: FavProvider) {}

  @Post(':post')
  @HttpCode(HttpStatus.NO_CONTENT)
  add(@Param() param: AddFavParam, @UserCurrent() user: User): Promise<void> {
    const { id } = user
    const { post } = param

    return this.provider.add.run(post, id)
  }

  @Delete(':post')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() param: RemoveFavParam, @UserCurrent() user: User): Promise<void> {
    const { id } = user
    const { post } = param

    return this.provider.remove.run(post, id)
  }
}
