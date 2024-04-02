import { PartialType } from '@nestjs/swagger';
import { CreateShoppingListDto } from './create-shopping-list.dto';

export class UpdateShoppingListDto extends PartialType(CreateShoppingListDto) {}
