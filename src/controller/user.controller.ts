import 'reflect-metadata'
import { JsonController, Param, Body, Get, Post, Put, Delete, QueryParams } from 'routing-controllers'
import { Service } from 'typedi'
import { UserRepository } from '../repository/UserRepository'
import { GetAllQuery } from './user.model'

@Service()
@JsonController()
export class UserController {
  userRepository = new UserRepository()

  constructor() {
    this.userRepository = new UserRepository()
  }

  @Get('/user')
  getAll(@QueryParams() query:GetAllQuery /** 使用class-validator来实现参数拦截 **/) {
    return this.userRepository.queryAll()
  }

  @Get('/user/:id')
  getOne(@Param('id') id: number) {
    return this.userRepository.query(id)
  }

  @Post('/user')
  post(@Body() input: any) {
    return this.userRepository.insert(input)
  }

  @Delete('/user/:id')
  remove(@Param('id') id: number) {
    return this.userRepository.delete(id)
  }
}
