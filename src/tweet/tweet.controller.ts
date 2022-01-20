import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common"
import { CurrentUser } from "auth/decorators/currentUser.decorator"
import { CurrentUserDTO } from "auth/dto/current-user.dto"
import { JwtAuthGuard } from "auth/guard/jwt.guard"
import { Types } from "mongoose"
import { CreateTweetDTO } from "./dto/create-tweet.dto"
import { UpdateTweetDTO } from "./dto/update-tweet.dto"
import { TweetService } from "./tweet.service"

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

  @Get()
  all() {
    return this.tweetService.findAll()
  }

  @Get(":id")
  getById(@Param("id") id: Types.ObjectId) {
    return this.tweetService.findById(id)
  }

  @Post(":id")
  update(
    @Param("id") id: Types.ObjectId,
    @Body() updateTweetDTO: UpdateTweetDTO,
  ) {
    return this.tweetService.update(id, updateTweetDTO)
  }

  @Delete(":id")
  delete(@Param("id") id: Types.ObjectId) {
    return this.tweetService.delete(id)
  }
}
