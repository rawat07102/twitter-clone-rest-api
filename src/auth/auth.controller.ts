import { Body, Controller, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { LoginDTO } from "./dto/login.dto"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  login(@Body() loginDTO: LoginDTO) {
    console.log(loginDTO)
    return this.authService.login(loginDTO)
  }
}
