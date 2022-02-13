import { Types } from "mongoose"

export class SetupProfileDTO {
  profilePic: Types.ObjectId
  headerPic: Types.ObjectId
  bio: string
}
