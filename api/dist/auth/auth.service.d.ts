import { UsersService } from "../users/users.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { EmailsService } from "../emails/emails.service";
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly emailsService;
    private readonly saltOrRounds;
    constructor(usersService: UsersService, jwtService: JwtService, emailsService: EmailsService);
    private validateUserToken;
    signup(signUpDto: SignUpDto): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        token: string;
        createdAt: Date;
    }>;
    validateUser(email: string, pass: string): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        token: string;
        createdAt: Date;
    }>;
    login(user: User): Promise<{
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
    forgotPassword(email: string): Promise<void>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        token: string;
        createdAt: Date;
    }>;
}
