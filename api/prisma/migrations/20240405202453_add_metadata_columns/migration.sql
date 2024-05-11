/*
  Warnings:

  - You are about to drop the `_ShoppingListToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdByUserId` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ShoppingListToUser" DROP CONSTRAINT "_ShoppingListToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShoppingListToUser" DROP CONSTRAINT "_ShoppingListToUser_B_fkey";

-- AlterTable
ALTER TABLE "ListItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ShoppingList" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdByUserId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "_ShoppingListToUser";

-- CreateTable
CREATE TABLE "_UsersWithShoppingListAccess" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UsersWithShoppingListAccess_AB_unique" ON "_UsersWithShoppingListAccess"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersWithShoppingListAccess_B_index" ON "_UsersWithShoppingListAccess"("B");

-- AddForeignKey
ALTER TABLE "ShoppingList" ADD CONSTRAINT "ShoppingList_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersWithShoppingListAccess" ADD CONSTRAINT "_UsersWithShoppingListAccess_A_fkey" FOREIGN KEY ("A") REFERENCES "ShoppingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersWithShoppingListAccess" ADD CONSTRAINT "_UsersWithShoppingListAccess_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
