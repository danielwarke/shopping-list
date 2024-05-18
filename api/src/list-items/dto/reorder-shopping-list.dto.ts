import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

class ReorderItem {
  @IsString()
  listItemId: string;

  @IsNumber()
  sortOrder: number;
}

export class ReorderShoppingListDto {
  @IsArray()
  @Type(() => ReorderItem)
  @ValidateNested({ each: true })
  order: ReorderItem[];
}
