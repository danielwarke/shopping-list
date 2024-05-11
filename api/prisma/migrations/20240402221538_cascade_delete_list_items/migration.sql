-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_shoppingListId_fkey";

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "ShoppingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
