import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { EmailsService } from "./emails.service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: configService.get<string>("EMAIL_TRANSPORT"),
        defaults: {
          from: `"Shopping List" <${configService.get<string>("EMAIL_FROM")}>`,
        },
        template: {
          dir: __dirname + "/templates",
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
