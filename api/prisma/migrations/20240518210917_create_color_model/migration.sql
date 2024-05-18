-- AlterTable
ALTER TABLE "ShoppingList" ADD COLUMN     "colorId" TEXT;

-- CreateTable
CREATE TABLE "ListColor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex" TEXT NOT NULL,

    CONSTRAINT "ListColor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShoppingList" ADD CONSTRAINT "ShoppingList_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "ListColor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
