"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const emails_service_1 = require("../emails/emails.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, emailsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailsService = emailsService;
        this.saltOrRounds = 10;
    }
    async validateUserToken(token, tokenType) {
        let userId;
        let userTokenType;
        try {
            const { sub, type } = await this.jwtService.verifyAsync(token);
            userId = sub;
            userTokenType = type;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message.replace("jwt", "token"));
        }
        if (userTokenType !== tokenType) {
            throw new common_1.ConflictException("Invalid token type");
        }
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (user.token !== token) {
            throw new common_1.UnprocessableEntityException("Token is invalid");
        }
        return user;
    }
    async signup(signUpDto) {
        const { name, email } = signUpDto;
        const existingUser = await this.usersService.fineOneByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException(`User with email address ${email} already exists`);
        }
        const hashedPass = await bcrypt.hash(signUpDto.password, this.saltOrRounds);
        const user = await this.usersService.create({
            name,
            email,
            password: hashedPass,
        });
        const tokenPayload = { sub: user.id, type: "email" };
        const verifyEmailToken = this.jwtService.sign(tokenPayload, {
            expiresIn: "1 year",
        });
        await this.usersService.setToken(email, verifyEmailToken);
        this.emailsService.verifyEmail(email, name, verifyEmailToken);
        const { password } = user, rest = __rest(user, ["password"]);
        return rest;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.fineOneByEmail(email);
        if (user) {
            const { password: userPass } = user, result = __rest(user, ["password"]);
            const isMatch = await bcrypt.compare(pass, userPass);
            if (isMatch) {
                return result;
            }
        }
        return null;
    }
    async login(user) {
        if (!user.emailVerified) {
            this.emailsService.verifyEmail(user.email, user.name, user.token);
            throw new common_1.UnauthorizedException("Please verify your email address before logging in. A new verification email has been sent.");
        }
        const payload = { sub: user.id, email: user.email, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async verifyEmail(verifyEmailDto) {
        const user = await this.validateUserToken(verifyEmailDto.token, "email");
        return this.usersService.verifyEmail(user.email);
    }
    async forgotPassword(email) {
        const user = await this.usersService.fineOneByEmail(email);
        if (!user || !user.emailVerified) {
            return;
        }
        try {
            const payload = { sub: user.id, type: "password" };
            const resetToken = this.jwtService.sign(payload, { expiresIn: "10m" });
            await this.usersService.setToken(email, resetToken);
            this.emailsService.forgotPassword(email, user.name, resetToken);
        }
        catch (e) {
            console.error(e);
        }
    }
    async resetPassword(resetPasswordDto) {
        const user = await this.validateUserToken(resetPasswordDto.token, "password");
        const hashedPass = await bcrypt.hash(resetPasswordDto.password, this.saltOrRounds);
        const updatedUser = await this.usersService.resetPassword(user.email, hashedPass);
        const { password } = updatedUser, rest = __rest(updatedUser, ["password"]);
        return rest;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        emails_service_1.EmailsService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map