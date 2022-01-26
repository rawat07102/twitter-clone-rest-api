import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "user/user.service"
import { LoginDTO } from "./dto/login.dto"

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO) {
    const user = await this.userService.findByUsername(loginDTO.username)
    if (!user || user.password !== loginDTO.password) {
      throw new UnauthorizedException()
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      username: user.username,
    })

    return {
      accessToken,
      id: user.id,
    }
  }
}
