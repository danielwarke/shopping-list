import { PrismaService } from "../database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        password: string;
        token: string;
        createdAt: Date;
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        password: string;
        token: string;
        createdAt: Date;
    }>;
    fineOneByEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        password: string;
        token: string;
        createdAt: Date;
    }>;
    setToken(email: string, token: string): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        password: string;
        token: string;
        createdAt: Date;
    }>;
    verifyEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        password: string;
        token: string;
        createdAt: Date;
    }>;
    resetPassword(email: string, password: string): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: Date;
        password: string;
        token: string;
        createdAt: Date;
    }>;
}
