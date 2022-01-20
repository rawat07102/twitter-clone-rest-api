import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDTO } from "./dto/login.dto"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.createAuthToken(loginDTO)
  }
}
