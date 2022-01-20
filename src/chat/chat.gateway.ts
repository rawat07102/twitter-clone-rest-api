import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets"

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage("chat")
  handleChat(@MessageBody() data: string) {
    return data
  }
}
