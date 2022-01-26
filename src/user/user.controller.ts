import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDTO } from "./dto/create-user.dto"
import { Types } from "mongoose"
import { CurrentUser } from "auth/decorators/currentUser.decorator"
import { CurrentUserDTO } from "auth/dto/current-user.dto"
import { JwtAuthGuard } from "auth/guard/jwt.guard"
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger"

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO)
  }

  @Get("all")
  async findAll() {
    return this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get("current")
  async currentUser(@CurrentUser() currentUser: CurrentUserDTO) {
    return this.userService.findById(currentUser.id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: "id",
    type: String,
  })
  @Get(":id")
  async getById(@Param("id") id: Types.ObjectId) {
    return this.userService.findById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch("follow/:id")
  async follow(
    @Param("id") id: Types.ObjectId,
    @CurrentUser() user: CurrentUserDTO,
  ) {
    return this.userService.addFollower(id, user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch("unfollow/:id")
  async unfollow(
    @Param("id") id: Types.ObjectId,
    @CurrentUser() user: CurrentUserDTO,
  ) {
    return this.userService.removeFollower(id, user.id)
  }

  @Delete(":id")
  async delete(@Param("id") id: Types.ObjectId) {
    return this.userService.delete(id)
  }
}
