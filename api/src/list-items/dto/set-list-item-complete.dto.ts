import { IsBoolean } from "class-validator";

export class SetListItemCompleteDto {
    @IsBoolean()
    complete: boolean;
}
