import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { CurrentUser } from "auth/decorators/currentUser.decorator"
import { CurrentUserDTO } from "auth/dto/current-user.dto"
import { JwtAuthGuard } from "auth/guard/jwt.guard"
import { Types } from "mongoose"
import { CreateTweetDTO } from "./dto/create-tweet.dto"
import { UpdateTweetDTO } from "./dto/update-tweet.dto"
import { TweetService } from "./tweet.service"

@ApiTags("tweet")
@Controller("tweet")
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createTweetDTO: CreateTweetDTO,
    @CurrentUser() currentUser: CurrentUserDTO,
  ) {
    return this.tweetService.create(currentUser.id, createTweetDTO)
  }

  @Get("all")
  all() {
    return this.tweetService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get("timeline")
  tweetsForMe(@CurrentUser() currentUser: CurrentUserDTO) {
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
  delete(@Param("id") id: Types.ObjectId) {
    return this.tweetService.delete(id)
  }
}
