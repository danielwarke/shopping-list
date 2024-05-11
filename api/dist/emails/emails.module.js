"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailsModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const emails_service_1 = require("./emails.service");
let EmailsModule = class EmailsModule {
};
EmailsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRootAsync({
                useFactory: (configService) => ({
                    transport: configService.get("EMAIL_TRANSPORT"),
                    defaults: {
                        from: `"Shopping List" <${configService.get("EMAIL_FROM")}>`,
                    },
                    template: {
                        dir: __dirname + "/templates",
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [emails_service_1.EmailsService],
        exports: [emails_service_1.EmailsService],
    })
], EmailsModule);
exports.EmailsModule = EmailsModule;
//# sourceMappingURL=emails.module.js.map