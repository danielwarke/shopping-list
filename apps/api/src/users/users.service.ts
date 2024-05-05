import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async fineOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async setToken(email: string, token: string) {
    return this.prisma.user.update({
      data: {
        token,
      },
      where: {
        email,
      },
    });
  }

  async resetPassword(email: string, password: string) {
    return this.prisma.user.update({
      data: {
        token: null,
        password,
      },
      where: {
        email,
      },
    });
  }
}
