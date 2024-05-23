/*
  Warnings:

  - Added the required column `createdByUserId` to the `ListItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShoppingList" DROP CONSTRAINT "ShoppingList_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "ListItem" ADD COLUMN     "createdByUserId" TEXT NULL;

-- AddForeignKey
ALTER TABLE "ShoppingList" ADD CONSTRAINT "ShoppingList_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

UPDATE "ListItem"
SET "createdByUserId" = "ShoppingList"."createdByUserId"
FROM "ShoppingList"
WHERE "ListItem"."shoppingListId" = "ShoppingList"."id";

ALTER TABLE "ListItem" ALTER COLUMN     "createdByUserId" SET NOT NULL;
