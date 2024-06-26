import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../common/guards";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { Public } from "src/common/decorators";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { JwtRequest } from "../types";

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

  @Post("request-verification-email")
  requestVerificationEmail(@Req() req: JwtRequest) {
    const { userId, name, email } = req.user;
    return this.authService.requestVerificationEmail(userId, email, name);
  }

  @Post("verify-email")
  verifyEmail(@Req() req: JwtRequest, @Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(req.user.userId, verifyEmailDto);
  }

  @Post("forgot-password")
  @Public()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post("reset-password")
  @Public()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get("profile")
  @ApiBearerAuth()
  getProfile(@Req() req: JwtRequest) {
    return req.user;
  }
}
