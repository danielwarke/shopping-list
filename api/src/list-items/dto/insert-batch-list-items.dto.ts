import { IsNumber, IsString } from "class-validator";

export class InsertBatchListItemsDto {
  @IsString({ each: true })
  items: string[];

  @IsNumber()
  sortOrder: number;
}
