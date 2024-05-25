import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const colors: { name: string; hex: string; darkHex: string }[] = [
    { name: "Coral", hex: "#faafa8", darkHex: "#77172e" },
    { name: "Peach", hex: "#f39f76", darkHex: "#692b17" },
    { name: "Sand", hex: "#fff8b8", darkHex: "#7c4a03" },
    { name: "Mint", hex: "#e2f6d3", darkHex: "#264d3b" },
    { name: "Sage", hex: "#b4ddd3", darkHex: "#0c625d" },
    { name: "Fog", hex: "#d4e4ed", darkHex: "#256377" },
    { name: "Storm", hex: "#aeccdc", darkHex: "#284255" },
    { name: "Dusk", hex: "#d3bfdb", darkHex: "#472e5b" },
    { name: "Blossom", hex: "#f6e2dd", darkHex: "#6c394f" },
    { name: "Clay", hex: "#e9e3d4", darkHex: "#4b443a" },
    { name: "Chalk", hex: "#efeff1", darkHex: "#232427" },
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
