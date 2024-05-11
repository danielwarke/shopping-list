import { IsString } from "class-validator";

export class RenameListItemDto {
  @IsString()
  name: string;
}
