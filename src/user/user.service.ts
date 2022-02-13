import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Document, Model, Types } from "mongoose"
import { User } from "./entities/user.entity"
import { CreateUserDTO } from "./dto/create-user.dto"
import { NotificationService } from "notification/notification.service"
import { PopulatedUser } from "./interfaces/user.populated"
import { SetupProfileDTO } from "./dto/setup-profile.dto"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async create(createUserDTO: CreateUserDTO) {
    const user = await this.userModel.create(createUserDTO)
    return user.id
  }

  async findAll(skip = 0, limit = 10) {
    return this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .select("id username")
      .exec()
  }

  async findById(id: Types.ObjectId) {
    const userDoc = await this.userModel.findById(id).select("-password")
    return userDoc
  }

  async profile(id: Types.ObjectId) {
    const userDoc = await this.userModel
      .findById(id)
      .select("-password")
      .populate<Pick<PopulatedUser, "profilePic" | "headerPic">>(
        "profilePic headerPic",
      )
    return userDoc
  }

  async findByUsername(username: string) {
    try {
      const user = await this.userModel.findOne({ username })
      if (!user) {
        throw new Error("user not found.")
      }
      return user
    } catch (err) {
      console.log(err)
    }
  }

  async sanitize(
    userDoc: Document<any, any, User> &
      User & {
        _id: Types.ObjectId
      },
  ) {
    const { password, ...user } = userDoc.toJSON()
    return user
  }

  async findUserNotifications(id: Types.ObjectId) {
    const user = await this.userModel
      .findById(id)
      .populate<Pick<PopulatedUser, "notifications">>("notifications")
    return user.notifications
  }

  async addNewTweet(userId: Types.ObjectId, tweetId: Types.ObjectId) {
    const user = await this.userModel.findByIdAndUpdate(userId, {
      $push: {
        tweets: {
          $each: [tweetId],
          $position: 0,
        },
      },
    })

    // add new tweet followers' timeline
    for (let i = 0; i < user.followers.length; i++) {
      const follower = user.followers[i]
      await this.addTweetToTimeline(follower, tweetId)
    }

    return user.tweets
  }

  async setupProfile(userId: Types.ObjectId, data: SetupProfileDTO) {
    return this.userModel.findByIdAndUpdate(userId, {
      $set: {
        ...data,
      },
    })
  }

  async addTweetToTimeline(userId: Types.ObjectId, tweetId: Types.ObjectId) {
    return this.userModel.findByIdAndUpdate(userId, {
      $push: {
        tweets: {
          $each: [tweetId],
          $position: 0,
        },
      },
    })
  }

  async removeTweetFromTimeline(
    userId: Types.ObjectId,
    tweetId: Types.ObjectId,
  ) {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: tweetId,
    })
  }

  async addLikedTweet(userId: Types.ObjectId, tweetId: Types.ObjectId) {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: {
        likedTweets: tweetId,
      },
    })
  }

  async removeLikedTweet(userId: Types.ObjectId, tweetId: Types.ObjectId) {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: {
        likedTweets: tweetId,
      },
    })
  }

  async addNotification(
    userId: Types.ObjectId,
    notificationId: Types.ObjectId,
  ) {
    return this.userModel.findByIdAndUpdate(userId, {
      $push: {
        notifications: {
          $each: [notificationId],
          $position: 0,
        },
      },
    })
  }

  async addFollower(userId: Types.ObjectId, followerId: Types.ObjectId) {
    const user = await this.userModel.findById(userId)
    const follower = await this.userModel.findById(followerId)
    user.followers.push(follower.id)
    follower.following.push(user.id)
    await user.save()
    await follower.save()
    return { user, follower }
  }

  async removeFollower(userId: Types.ObjectId, followerId: Types.ObjectId) {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: {
        followers: followerId,
      },
    })
    await this.userModel.findByIdAndUpdate(followerId, {
      $pull: {
        following: userId,
      },
    })
    return true
  }

  async removeTweet(userId: Types.ObjectId, tweetId: Types.ObjectId) {
    const user = await this.userModel.findByIdAndUpdate(userId, {
      $pull: {
        tweets: tweetId,
      },
    })
    for (let i = 0; i < user.followers.length; i++) {
      const followerId = user.followers[i]
      await this.removeTweetFromTimeline(followerId, tweetId)
    }
  }

  async delete(id: Types.ObjectId) {
    return this.userModel.findByIdAndDelete(id)
  }

  async deleteAll() {
    const query = await this.userModel.deleteMany()
    return query.deletedCount
  }
}
