import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { User } from "user/entities/user.entity"
import { UserService } from "user/user.service"
import { CreateChatDTO } from "./dto/create-chat.dto"
import { SendMessageDTO } from "./dto/send-message.dto"
import { Chat, Message } from "./entities/chat.entity"

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private userService: UserService,
  ) {}

  private newMessage(body: string, from: User) {
    const message = new Message()
    message.body = body
    message.from = from
    return message
  }

  async getById(id: string) {
    const chat = await this.chatModel
      .findById(id)
      .populate("users messages.from")
    return chat
  }

  async getUserChats(userId: string) {
    const chat = await this.chatModel
      .find({ "users.1": userId })
      .populate("users messages.from")

    return chat
  }

  async create({ toId, messageBody }: CreateChatDTO, fromId: Types.ObjectId) {
    const chat = new this.chatModel()
    const fromUser = await this.userService.findById(fromId)
    const toUser = await this.userService.findById(toId)
    const message = this.newMessage(messageBody, fromUser)

    chat.users.push(fromUser.id, toUser.id)
    chat.messages.push(message)

    await chat.save()
    return chat
  }

  async sendMessage({ body, chatId }: SendMessageDTO, from: Types.ObjectId) {
    const chat = await this.chatModel.findById(chatId)
    const fromUser = await this.userService.findById(from)
    const message = this.newMessage(body, fromUser)

    chat.messages.push(message)

    await chat.save()
    return message
  }
}
