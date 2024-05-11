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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const guards_1 = require("../common/guards");
const sign_up_dto_1 = require("./dto/sign-up.dto");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const login_dto_1 = require("./dto/login.dto");
const decorators_1 = require("../common/decorators");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const types_1 = require("../types");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signUp(signupDto) {
        return this.authService.signup(signupDto);
    }
    login(req) {
        return this.authService.login(req.user);
    }
    verifyEmail(verifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto);
    }
    forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }
    resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
    getProfile(req) {
        return req.user;
    }
};
__decorate([
    (0, common_1.Post)("signup"),
    (0, decorators_1.Public)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_dto_1.SignUpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, decorators_1.Public)(),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, common_1.UseGuards)(guards_1.LocalAuthGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("verify-email"),
    (0, decorators_1.Public)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    (0, decorators_1.Public)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    (0, decorators_1.Public)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, swagger_1.ApiBearerAuth)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.JwtRequest]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map