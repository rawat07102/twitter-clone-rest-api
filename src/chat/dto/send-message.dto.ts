import { Types } from "mongoose"

export class SendMessageDTO {
  chatId: Types.ObjectId
  body: string
}
