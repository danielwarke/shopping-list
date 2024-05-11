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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailsService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let EmailsService = class EmailsService {
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
    }
    buildUrl(path, token) {
        const clientDomain = this.configService.get("CLIENT_DOMAIN");
        return `${clientDomain}/${path}?token=${token}`;
    }
    verifyEmail(toEmail, name, token) {
        const url = this.buildUrl("verify-email", token);
        return this.mailerService.sendMail({
            to: toEmail,
            subject: "Shopping List - Verify Email Address",
            template: "./verify-email",
            context: {
                url,
                name,
            },
        });
    }
    forgotPassword(toEmail, name, token) {
        const url = this.buildUrl("reset-password", token);
        return this.mailerService.sendMail({
            to: toEmail,
            subject: "Shopping List - Forgot Password",
            template: "./forgot-password",
            context: {
                url,
                name,
            },
        });
    }
    shareShoppingList(toEmail, inviter, invitee, shoppingList, token) {
        const url = this.buildUrl("accept-list-invite", token);
        return this.mailerService.sendMail({
            to: toEmail,
            subject: "Shopping List - Invite to Share Shopping List",
            template: "./invite-user",
            context: {
                inviter,
                invitee,
                shoppingList,
                url,
            },
        });
    }
};
EmailsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], EmailsService);
exports.EmailsService = EmailsService;
//# sourceMappingURL=emails.service.js.map