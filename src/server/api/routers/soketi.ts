import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import Pusher from "pusher";
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";

export const soketi = new Pusher({
  host: env.SOKETI_HOST,
  appId: env.SOKETI_APP_ID,
  key: env.SOKETI_APP_KEY,
  secret: env.SOKETI_APP_SECRET,
  cluster: "mt1",
  port: env.SOKETI_PORT,
  useTLS: true,
});
export const soketiRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(z.object({ message: z.string(), channel: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const now = new Date();
      await soketi
        .trigger(input.channel, "chat-event", {
          content: input.message,
          author: ctx.session?.user,
          createdAt: now.toISOString(),
        })
        .catch(() => {
          throw new TRPCError({
            message: "Error sending message",
            code: "INTERNAL_SERVER_ERROR",
          });
        });
      ctx.prisma.message
        .create({
          data: {
            content: input.message,
            channel: {
              connect: {
                id: input.channel,
              },
            },
            author: {
              connect: {
                id: ctx.session?.user.id,
              },
            },
            createdAt: now,
          },
        })
        .catch(() => {
          // TODO: Retry saving the message.
          throw new TRPCError({
            message: "Error saving message",
            code: "INTERNAL_SERVER_ERROR",
          });
        });
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        channel: z.string(),
        cursor: z.number().nullish(),
        limit: z.number().min(1).max(100).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const messages = await ctx.prisma.message.findMany({
        take: limit + 1,
        include: {
          author: true,
        },
        where: {
          channel: {
            id: input.channel,
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }
      return { messages, nextCursor };
    }),
});
