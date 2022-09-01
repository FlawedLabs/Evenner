import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const data = Array.from({ length: 15 }).map(() => ({
    title: faker.hacker.phrase(),
    content: faker.lorem.paragraph(),
    published: faker.datatype.boolean(),
    coverPicture: faker.image.imageUrl(),
    startTime: faker.date.future().getTime().toString(),
    endTime: faker.date.future().getTime().toString(),
    startDate: faker.date.future(),
    endDate: faker.date.future(),
    location: faker.address.city(),
    position: {
        lat: faker.address.latitude(),
        long: faker.address.longitude(),
    },
    isInPerson: faker.datatype.boolean(),
    authorId: '3a8c6a94-380e-4b05-97f4-252377afa6f7',
    isPrivate: faker.datatype.boolean(),
}));

const prisma = new PrismaClient();

async function main() {
    await prisma.event.createMany({
        data,
    });
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
