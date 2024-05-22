/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { monkeyPictureRouter } from './monkey';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  monkey: monkeyPictureRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
