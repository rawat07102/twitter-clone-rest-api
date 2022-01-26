import { ApiProperty } from "@nestjs/swagger"

export class SendMessageDTO {
  @ApiProperty()
  body: string
}
