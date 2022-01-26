import { ApiProperty } from "@nestjs/swagger"

export class CreateTweetDTO {
  @ApiProperty()
  body: string
}
