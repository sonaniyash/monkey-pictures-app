/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.monkeyPicture.createMany({
    data: [
      { description: 'Monkey 1', url: 'https://as2.ftcdn.net/v2/jpg/01/66/10/03/1000_F_166100342_KbTGIRrnrlwGDZSXSMpH3zfn2dxyTKae.jpg' },
      { description: 'Monkey 2', url: 'https://as1.ftcdn.net/v2/jpg/00/25/05/24/1000_F_25052487_jmXZwqXuHAxodojb5xbmFOH2dCxVU9g4.jpg' },
      { description: 'Monkey 3', url: 'https://as2.ftcdn.net/v2/jpg/00/01/97/41/1000_F_1974128_GQwgCi5KLMNOumnBh4xpCDj7zMsGuI.jpg' },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
