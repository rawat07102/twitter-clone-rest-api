import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDTO } from "./dto/create-user.dto"
import { Types } from "mongoose"
import { CurrentUser } from "auth/decorators/currentUser.decorator"
import { CurrentUserDTO } from "auth/dto/current-user.dto"
import { JwtAuthGuard } from "auth/guard/jwt.guard"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ImageService } from "image/image.service"

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly imageService: ImageService,
  ) {}

  @Post("signup")
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO)
  }

  @Get("all")
  async findAll() {
    return this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get("session")
  async currentUser(@CurrentUser() currentUser: CurrentUserDTO) {
    const user = await this.userService.findById(currentUser.id)
    return {
      id: user.id,
      username: user.username,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("byId/:id")
  async getById(@Param("id") id: Types.ObjectId) {
    return this.userService.findById(id)
  }

  @Get(":username")
  async getByUsername(@Param("username") username: string) {
    const userDoc = await this.userService.findByUsername(username)
    return this.userService.sanitize(userDoc)
  }

  @Get("search/:searchQuery")
  async search(@Param("searchQuery") searchQuery: string) {
    return this.userService.search(searchQuery)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "profilePic", maxCount: 1 },
      { name: "headerPic", maxCount: 1 },
    ]),
  )
  @Patch("profile/setup")
  async setupProfile(
    @CurrentUser() currentUser: CurrentUserDTO,
    @Body("bio") bio: string,
    @UploadedFiles()
    files: {
      profilePic: Express.Multer.File[]
      headerPic: Express.Multer.File[]
    },
  ) {
    const profileFile = files.profilePic[0]
    const headerFile = files.headerPic[0]
    const profilePic = await this.imageService.create({
      data: profileFile.buffer.toString("base64"),
      mimetype: profileFile.mimetype,
    })
    const headerPic = await this.imageService.create({
      data: headerFile.buffer.toString("base64"),
      mimetype: headerFile.mimetype,
    })

    const user = await this.userService.findById(currentUser.id)
    await this.imageService.delete(user.profilePic)
    await this.imageService.delete(user.headerPic)

    return this.userService.setupProfile(currentUser.id, {
      bio,
      headerPic: headerPic.id,
      profilePic: profilePic.id,
    })
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
