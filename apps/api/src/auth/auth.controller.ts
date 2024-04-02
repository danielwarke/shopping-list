import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../common/guards";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { Public } from "src/common/decorators";

@Controller()
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @Public()
  signUp(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }

  @Post("login")
  @Public()
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get("profile")
  @ApiBearerAuth()
  getProfile(@Req() req) {
    return req.user;
  }
}
