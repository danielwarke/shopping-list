import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
export declare class EmailsService {
    private readonly mailerService;
    private readonly configService;
    constructor(mailerService: MailerService, configService: ConfigService);
    private buildUrl;
    verifyEmail(toEmail: string, name: string, token: string): Promise<SentMessageInfo>;
    forgotPassword(toEmail: string, name: string, token: string): Promise<SentMessageInfo>;
    shareShoppingList(toEmail: string, inviter: string, invitee: string, shoppingList: string, token: string): Promise<SentMessageInfo>;
}
