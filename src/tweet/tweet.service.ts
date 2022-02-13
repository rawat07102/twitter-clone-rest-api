import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { UserService } from "user/user.service"

import { Tweet } from "./entities/tweet.entity"
import { CreateTweetDTO } from "./dto/create-tweet.dto"
import { UpdateTweetDTO } from "./dto/update-tweet.dto"
import { NotificationService } from "notification/notification.service"
import { PopulatedTweet } from "./interfaces/tweet.populated"

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(Tweet.name) private readonly tweetModel: Model<Tweet>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    authorId: Types.ObjectId,
    createTweetDTO: CreateTweetDTO,
    imageId: Types.ObjectId | null,
  ) {
    const tweet = await this.tweetModel.create({
      ...createTweetDTO,
      image: imageId,
    })
    await this.userService.addNewTweet(authorId, tweet.id)
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

  async timeline(id: Types.ObjectId) {
    const user = await this.userService.findById(id)
    return user.timeline
  }

  async addLike(userId: Types.ObjectId, tweetId: Types.ObjectId) {
    await this.tweetModel.findByIdAndUpdate(tweetId, {
      $inc: {
        likes: 1,
      },
    })
    await this.userService.addLikedTweet(userId, tweetId)
    return true
  }

  async removeLike(userId: Types.ObjectId, tweetId: Types.ObjectId) {
    await this.tweetModel.findByIdAndUpdate(tweetId, {
      $inc: {
        likes: -1,
      },
    })
    await this.userService.addLikedTweet(userId, tweetId)
    return true
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
