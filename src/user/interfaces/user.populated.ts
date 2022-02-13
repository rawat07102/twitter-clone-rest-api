import { Image } from "image/entities/image.entity"
import { Notification } from "notification/entities/notification.entity"
import { Tweet } from "tweet/entities/tweet.entity"
import { User } from "user/entities/user.entity"

export interface PopulatedUser {
  profilePic: Image
  headerPic: Image
  tweets: Tweet[]
  followers: User[]
  following: User[]
  notifications: Notification[]
}
