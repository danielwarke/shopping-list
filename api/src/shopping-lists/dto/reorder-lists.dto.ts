import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

class ReorderList {
  @IsString()
  shoppingListId: string;

  @IsNumber()
  sortOrder: number;
}

export class ReorderListsDto {
  @IsArray()
  @Type(() => ReorderList)
  @ValidateNested({ each: true })
  order: ReorderList[];
}
