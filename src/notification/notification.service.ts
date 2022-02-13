import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { UserService } from "user/user.service"
import { Notification, NotificationType } from "./entities/notification.entity"

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  private async create(
    user: Types.ObjectId,
    tweet: Types.ObjectId,
    type: NotificationType,
  ) {
    const notification = new this.notificationModel({
      tweet,
      type,
    })
    await this.userService.addNotification(user, notification.id)
    await notification.save()
    return notification
  }

  async createNewTweetNotification(
    user: Types.ObjectId,
    tweet: Types.ObjectId,
  ) {
    return this.create(user, tweet, NotificationType.NEW_TWEET)
  }

  async getById(id: Types.ObjectId) {
    return this.notificationModel.findById(id)
  }

  async updateReadStatus(notificationId: Types.ObjectId, read: boolean) {
    return this.notificationModel.findByIdAndUpdate(notificationId, {
      $set: { read },
    })
  }
}
