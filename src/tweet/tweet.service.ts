import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { UserService } from "user/user.service"

import { Tweet } from "./entities/tweet.entity"
import { CreateTweetDTO } from "./dto/create-tweet.dto"
import { UpdateTweetDTO } from "./dto/update-tweet.dto"
import { NotificationType } from "notification/entities/notification.entity"
import { NotificationService } from "notification/notification.service"
import { PopulatedTweet } from "./interfaces/tweet.populated"

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(Tweet.name) private readonly tweetModel: Model<Tweet>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(authorId: Types.ObjectId, createTweetDTO: CreateTweetDTO) {
    const tweet = new this.tweetModel(createTweetDTO)
    const user = await this.userService.findById(authorId)
    tweet.author = user.id

    for (let i = 0; i < user.followers.length; i++) {
      await this.notificationService.create(
        user.followers[i],
        "New Tweet",
        NotificationType.NEW_TWEET,
      )
    }

    await tweet.save()
    return tweet
  }

  async findAll(skip = 0, limit = 10) {
    return this.tweetModel.find().skip(skip).limit(limit).exec()
  }

  async findById(id: Types.ObjectId) {
    return this.tweetModel
      .findById(id)
      .populate<Pick<PopulatedTweet, "author" | "replies" | "replyTo">>(
        "author replies replyTo",
      )
  }

  async update(id: Types.ObjectId, updateTweetDTO: UpdateTweetDTO) {
    const tweet = await this.findById(id)
    tweet.body = updateTweetDTO.body
    await tweet.save()
    return tweet
  }

  async addReply(
    tweetId: Types.ObjectId,
    userId: Types.ObjectId,
    body: string,
  ) {
    const user = await this.userService.findById(userId)
    if (!user) {
      throw new UnauthorizedException("User Not Authorized")
    }

    const tweet = await this.tweetModel.findById(tweetId)
    if (!tweet) {
      throw new BadRequestException(
        "Invalid Tweet ID, could not find Tweet with given ID",
      )
    }

    const reply = await this.tweetModel.create({
      author: user,
      body,
      replyTo: tweet,
    })

    tweet.replies.push(reply.id)
    await tweet.save()

    return reply
  }

  async deleteAll() {
    const query = await this.tweetModel.deleteMany()
    return query.deletedCount
  }

  async delete(id: Types.ObjectId) {
    return this.tweetModel.findByIdAndDelete(id)
  }
}
