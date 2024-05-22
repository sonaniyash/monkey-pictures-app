import { createContextInner } from '../context';
import type { inferProcedureInput } from '@trpc/server';
import type { AppRouter } from './_app';
import { createCaller } from './_app';
import { prisma } from '~/server/prisma';
import { expect, test, beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
    // Clear the database before running tests
    await prisma.monkeyPicture.deleteMany({});
});

afterAll(async () => {
    // Clear the database after running tests
    await prisma.monkeyPicture.deleteMany({});
    await prisma.$disconnect();
});

test('create and get monkey picture', async () => {
    const ctx = await createContextInner({});
    const caller = createCaller(ctx);

    const input: inferProcedureInput<AppRouter['monkey']['create']> = {
        url: 'http://example.com/monkey1.jpg',
        description: 'A monkey in a tree',
    };

    const newPicture = await caller.monkey.create(input);
    expect(newPicture).toMatchObject(input);

    const listResponse = await caller.monkey.list({
        pageIndex: 0,
        limitSize: 1,
    });
    expect(listResponse.pictures).toHaveLength(1);
    expect(listResponse.pictures[0]).toMatchObject(input);
});

test('delete monkey picture', async () => {
    const ctx = await createContextInner({});
    const caller = createCaller(ctx);

    const input: inferProcedureInput<AppRouter['monkey']['create']> = {
        url: 'http://example.com/monkey1.jpg',
        description: 'A monkey in a tree',
    };

    const newPicture = await caller.monkey.create(input);
    expect(newPicture).toMatchObject(input);

    const deleteResponse = await caller.monkey.delete({ id: newPicture.id });
    expect(deleteResponse).toEqual({ success: true });

    const listResponse = await caller.monkey.list({
        pageIndex: 0,
        limitSize: 10,
    });
    expect(listResponse.pictures.find(picture => picture.id === newPicture.id)).toBeUndefined();
});

test('pagination of monkey pictures', async () => {
    const ctx = await createContextInner({});
    const caller = createCaller(ctx);

    // Create multiple monkey pictures
    for (let i = 1; i <= 5; i++) {
        await caller.monkey.create({
            description: `Monkey picture ${i}`,
            url: `http://example.com/monkey${i}.jpg`,
        });
    }

    const firstPage = await caller.monkey.list({
        pageIndex: 0,
        limitSize: 2,
    });
    expect(firstPage.pictures).toHaveLength(2);
    expect(firstPage.total).toBeGreaterThanOrEqual(5);

    const secondPage = await caller.monkey.list({
        pageIndex: 1,
        limitSize: 2,
    });
    expect(secondPage.pictures).toHaveLength(2);
    expect(secondPage.total).toBeGreaterThanOrEqual(5);

    const thirdPage = await caller.monkey.list({
        pageIndex: 2,
        limitSize: 2,
    });
    expect(thirdPage.pictures).toHaveLength(2);
});
