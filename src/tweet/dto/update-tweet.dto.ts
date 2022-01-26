import { PartialType } from "@nestjs/swagger"
import { CreateTweetDTO } from "./create-tweet.dto"

export class UpdateTweetDTO extends PartialType(CreateTweetDTO) {}
