import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const channelRouter = createTRPCRouter({
  getPublicChannels: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.channel.findMany({
      where: {
        public: true,
      },
    });
  }),
});
