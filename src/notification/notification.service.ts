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

  async create(userId: Types.ObjectId, title: string, type: NotificationType) {
    const notification = new this.notificationModel({
      title,
      type,
    })
    await this.userService.addNotification(userId, notification.id) // await notification.save()
    return notification
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
