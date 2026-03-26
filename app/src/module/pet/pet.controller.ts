import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

import type { User } from '@/type/token'

import { UserCurrent } from '@/decorator/user.current.decorator'

import type {
  CreatePetRequest,
  GetPetParam,
  ListPetRequest,
  RemovePetParam,
  SavePetParam,
  SavePetRequest
} from './pet.request'
import type { PetResponse } from './pet.response'
import { PetProvider } from './provider'

@Controller('pet')
export class PetController {
  constructor(private readonly provider: PetProvider) {}

  @Get()
  list(@Query() request: ListPetRequest): Promise<PetResponse[]> {
    return this.provider.list.run(request)
  }

  @Get(':id')
  get(@Param() param: GetPetParam): Promise<PetResponse> {
    const { id } = param

    return this.provider.get.run(id)
  }

  @Post()
  create(@Body() request: CreatePetRequest, @UserCurrent() user: User): Promise<PetResponse> {
    const { id } = user

    return this.provider.create.run(request, id)
  }

  @Put(':id')
  save(
    @Param() param: SavePetParam,
    @Body() request: SavePetRequest,
    @UserCurrent() user: User
  ): Promise<PetResponse> {
    const { id } = param
    const { id: current } = user

    return this.provider.save.run(id, request, current)
  }

  @Delete(':id')
  remove(@Param() param: RemovePetParam, @UserCurrent() user: User): Promise<void> {
    const { id } = param
    const { id: current } = user

    return this.provider.remove.run(id, current)
  }
}
