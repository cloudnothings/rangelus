import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { soketiRouter } from "./routers/soketi";
import { channelRouter } from "./routers/channel";
import { stripeRouter } from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  soketi: soketiRouter,
  channel: channelRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
