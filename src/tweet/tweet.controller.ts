import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiTags } from "@nestjs/swagger"
import { CurrentUser } from "auth/decorators/currentUser.decorator"
import { CurrentUserDTO } from "auth/dto/current-user.dto"
import { JwtAuthGuard } from "auth/guard/jwt.guard"
import { ImageService } from "image/image.service"
import { Types } from "mongoose"
import { UserService } from "user/user.service"
import { CreateTweetDTO } from "./dto/create-tweet.dto"
import { UpdateTweetDTO } from "./dto/update-tweet.dto"
import { TweetService } from "./tweet.service"

@ApiTags("tweet")
@Controller("tweet")
export class TweetController {
  constructor(
    private readonly tweetService: TweetService,
    private readonly imageService: ImageService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Post()
  async create(
    @Body() createTweetDTO: CreateTweetDTO,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: CurrentUserDTO,
  ) {
    let imageId = null
    if (file) {
      const { buffer, mimetype } = file
      const data = buffer.toString("base64")
      imageId = await this.imageService.create({ data, mimetype })
    }
    return this.tweetService.create(currentUser.id, createTweetDTO, imageId)
  }

  @Get("all")
  all() {
    return this.tweetService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get("timeline")
  timeline(@CurrentUser() currentUser: CurrentUserDTO) {
    return this.tweetService.timeline(currentUser.id)
  }

  @Get(":id")
  getById(@Param("id") id: Types.ObjectId) {
    return this.tweetService.findById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id") id: Types.ObjectId,
    @Body() updateTweetDTO: UpdateTweetDTO,
  ) {
    return this.tweetService.update(id, updateTweetDTO)
  }

  @Get("delete/all")
  async deleteAll() {
    return this.tweetService.deleteAll()
  }

  @Delete("delete/:id")
  async delete(
    @Param("id") id: Types.ObjectId,
    @CurrentUser() currentUser: CurrentUserDTO,
  ) {
    await this.userService.removeTweet(currentUser.id, id)
    return this.tweetService.delete(id)
  }
}
