import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"

import { UserModule } from "user/user.module"
import { TweetModule } from "tweet/tweet.module"
import { AuthModule } from "auth/auth.module"
import { NotificationModule } from "notification/notification.module"

import { AppService } from "./app.service"
import { AppController } from "./app.controller"
// import { ChatModule } from "chat/chat.module"

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("MONGO_URI"),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TweetModule,
    AuthModule,
    NotificationModule,
    // ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
