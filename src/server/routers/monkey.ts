/**
 * This is the monkey picture router for managing monkey pictures.
 * Update `../pages/api/trpc/[trpc].tsx` to use this router.
 */

import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

export const monkeyPictureRouter = router({
    list: publicProcedure
        .input(
            z.object({
                pageIndex: z.number().int().nonnegative().optional().default(0),
                limitSize: z.number().int().positive().optional().default(2),
            }),
        )
        .query(async ({ input }) => {
            const { pageIndex, limitSize } = input;
            const skip = pageIndex * limitSize;
            const take = limitSize;

            const pictures = await prisma.monkeyPicture.findMany({
                skip,
                take,
            });

            const total = await prisma.monkeyPicture.count();

            return {
                pictures,
                total,
                pageIndex,
                limitSize,
            };
        }),
    create: publicProcedure
        .input(
            z.object({
                description: z.string().min(3).max(2000),
                url: z.string().min(3).max(500),
            }),
        )
        .mutation(async ({ input }) => {
            const { description, url } = input;
            const newPicture = await prisma.monkeyPicture.create({
                data: { description, url },
            });
            return newPicture;
        }),
    delete: publicProcedure
        .input(
            z.object({
                id: z.number().int().nonnegative(),
            }),
        )
        .mutation(async ({ input }) => {
            const { id } = input;
            const picture = await prisma.monkeyPicture.delete({
                where: { id },
            });
            if (!picture) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `No monkey picture with id '${id}'`,
                });
            }
            return { success: true };
        }),
});
