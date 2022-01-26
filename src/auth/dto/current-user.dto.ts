import { ApiHideProperty } from "@nestjs/swagger"
import { Types } from "mongoose"

export class CurrentUserDTO {
  @ApiHideProperty()
  id: Types.ObjectId

  @ApiHideProperty()
  username: string
}
