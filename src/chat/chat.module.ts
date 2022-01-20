import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Chat, ChatSchema } from "./entities/chat.entity"
import { UserModule } from "user/user.module"
import { ChatService } from "./chat.service"
import { ChatGateway } from "./chat.gateway"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    UserModule,
  ],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
