import { createTRPCRouter, publicProcedure } from "../trpc";

export const channelRouter = createTRPCRouter({
  getPublicChannels: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.channel.findMany({
      where: {
        public: true,
      },
    });
  }),
});
