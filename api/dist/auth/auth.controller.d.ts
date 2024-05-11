import { SignUpDto } from "./dto/sign-up.dto";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { JwtRequest } from "../types";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signupDto: SignUpDto): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        token: string;
        createdAt: Date;
    }>;
    login(req: any): Promise<{
        access_token: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        password: string;
        token: string;
        createdAt: Date;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        token: string;
        createdAt: Date;
    }>;
    getProfile(req: JwtRequest): {
        userId: string;
        email: string;
        name: string;
    };
}
