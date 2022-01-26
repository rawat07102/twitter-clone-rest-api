import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PassportModule } from "@nestjs/passport"

import { UserModule } from "user/user.module"
import { TweetModule } from "tweet/tweet.module"
import { AuthModule } from "auth/auth.module"
import { NotificationModule } from "notification/notification.module"

import { AppService } from "./app.service"
// import { ChatModule } from "chat/chat.module"

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    TweetModule,
    AuthModule,
    NotificationModule,
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    // ChatModule,
  ],
  providers: [AppService],
})
export class AppModule {}
