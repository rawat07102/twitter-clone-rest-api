import { Types } from "mongoose"

export class CurrentUserDTO {
  id: Types.ObjectId
  username: string
}
