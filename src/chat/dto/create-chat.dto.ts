import { Types } from "mongoose"

export class CreateChatDTO {
  toId: Types.ObjectId
  messageBody: string
}
