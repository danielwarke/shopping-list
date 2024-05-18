import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const colors: { name: string; hex: string }[] = [
    { name: "Coral", hex: "#faafa8" },
    { name: "Peach", hex: "#f39f76" },
    { name: "Sand", hex: "#fff8b8" },
    { name: "Mint", hex: "#e2f6d3" },
    { name: "Sage", hex: "#b4ddd3" },
    { name: "Fog", hex: "#d4e4ed" },
    { name: "Storm", hex: "#aeccdc" },
    { name: "Dusk", hex: "#d3bfdb" },
    { name: "Blossom", hex: "#f6e2dd" },
    { name: "Clay", hex: "#e9e3d4" },
    { name: "Chalk", hex: "#efeff1" },
  ];

  const createdColors = await prisma.$transaction(
    colors.map((color) =>
      prisma.listColor.create({
        data: color,
      }),
    ),
  );

  console.log("Successfully seeded database with list colors", createdColors);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
