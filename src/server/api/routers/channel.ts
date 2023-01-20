import { createTRPCRouter, protectedProcedure } from "../trpc";

export const channelRouter = createTRPCRouter({
  getPublicChannels: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.channel.findMany({
      where: {
        public: true,
      },
    });
  }),
});
