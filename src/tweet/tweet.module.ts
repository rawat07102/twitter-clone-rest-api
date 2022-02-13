import { Module } from "@nestjs/common"
import { TweetService } from "./tweet.service"
import { TweetController } from "./tweet.controller"
import { Tweet, TweetSchema } from "./entities/tweet.entity"
import { MongooseModule } from "@nestjs/mongoose"
import { NotificationModule } from "notification/notification.module"
import { UserModule } from "user/user.module"
import { ImageModule } from "image/image.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
    NotificationModule,
    UserModule,
    ImageModule,
  ],
  controllers: [TweetController],
  providers: [TweetService],
  exports: [TweetService],
})
export class TweetModule {}
