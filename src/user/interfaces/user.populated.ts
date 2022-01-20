import { Notification } from "notification/entities/notification.entity"
import { Tweet } from "tweet/entities/tweet.entity"
import { User } from "user/entities/user.entity"

export interface PopulatedUser {
  username: string
  password: string
  bio: string
  tweets: Tweet[]
  followers: User[]
  following: User[]
  notifications: Notification[]
}
