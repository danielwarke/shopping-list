import { IsString } from "class-validator";

export class AcceptListInviteDto {
    @IsString()
    token: string;
}
