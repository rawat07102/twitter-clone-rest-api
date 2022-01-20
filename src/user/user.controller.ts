import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDTO } from "./dto/create-user.dto"
import { Types } from "mongoose"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO)
  }

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Get(":id")
  getById(@Param("id") id: Types.ObjectId) {
    return this.userService.findById(id)
  }

  @Delete(":id")
  delete(@Param("id") id: Types.ObjectId) {
    return this.userService.delete(id)
  }
}
