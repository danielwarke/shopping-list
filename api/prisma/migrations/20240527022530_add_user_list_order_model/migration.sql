-- CreateTable
CREATE TABLE "UserListOrder" (
    "id" TEXT NOT NULL,
    "shoppingListId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "UserListOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserListOrder_shoppingListId_userId_key" ON "UserListOrder"("shoppingListId", "userId");

-- AddForeignKey
ALTER TABLE "UserListOrder" ADD CONSTRAINT "UserListOrder_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "ShoppingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserListOrder" ADD CONSTRAINT "UserListOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
