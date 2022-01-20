import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "user/user.service"
import { LoginDTO } from "./dto/Login.dto"

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async createAuthToken(loginDTO: LoginDTO) {
    const user = await this.userService.findByUsername(loginDTO.username)
    if (!user || user.password !== loginDTO.password) {
      throw new UnauthorizedException()
    }

    return this.jwtService.sign({
      id: user.id,
      username: user.username,
    })
  }
}
