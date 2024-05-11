import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private buildUrl(path: string, token: string) {
    const clientDomain = this.configService.get<string>("CLIENT_DOMAIN");
    return `${clientDomain}/${path}?token=${token}`;
  }

  verifyEmail(toEmail: string, name: string, token: string) {
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

  forgotPassword(toEmail: string, name: string, token: string) {
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

  shareShoppingList(
    toEmail: string,
    inviter: string,
    invitee: string,
    shoppingList: string,
    token: string,
  ) {
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
}
