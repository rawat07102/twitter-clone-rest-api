import { Tweet } from "tweet/entities/tweet.entity"
import { User } from "user/entities/user.entity"

export interface PopulatedTweet {
  body: string
  author: User
  replies: Tweet[]
  replyTo?: Tweet
}
