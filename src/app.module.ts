import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"

import { UserModule } from "user/user.module"
import { TweetModule } from "tweet/tweet.module"
import { AuthModule } from "auth/auth.module"
import { NotificationModule } from "notification/notification.module"

import { AppService } from "./app.service"
// import { ChatModule } from "chat/chat.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env["MONGO_URI"]),
    UserModule,
    TweetModule,
    AuthModule,
    NotificationModule,
    // ChatModule,
  ],
  providers: [AppService],
})
export class AppModule {}
