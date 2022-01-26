import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { User } from "./entities/user.entity"
import { CreateUserDTO } from "./dto/create-user.dto"
import { NotificationService } from "notification/notification.service"
import { PopulatedUser } from "./interfaces/user.populated"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async create(createUserDTO: CreateUserDTO) {
    const user = new this.userModel(createUserDTO)
    await user.save()
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

  async findByUsername(username: string) {
    return this.userModel.findOne({ username })
  }

  async findUserNotifications(id: Types.ObjectId) {
    const user = await this.userModel
      .findById(id)
      .populate<Pick<PopulatedUser, "notifications">>("notifications")
    return user.notifications
  }

  async updatebyId(userId: Types.ObjectId, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(userId, data)
  }

  async addNotification(
    userId: Types.ObjectId,
    notificationId: Types.ObjectId,
  ) {
    return this.userModel.findByIdAndUpdate(userId, {
      $push: { notifications: notificationId },
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
    const user = await this.userModel.findById(userId)
    const follower = await this.userModel.findById(followerId)
    user.followers = user.followers.filter((u) => u === userId)
    follower.following = follower.following.filter((f) => f === followerId)
    await user.save()
    await follower.save()
    return true
  }

  async delete(id: Types.ObjectId) {
    return this.userModel.findByIdAndDelete(id)
  }

  async deleteAll() {
    const query = await this.userModel.deleteMany()
    return query.deletedCount
  }
}
