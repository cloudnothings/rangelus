import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Stripe } from "stripe";
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";
const stripe = new Stripe(env.STRIPE_APP_SECRET, {
  apiVersion: "2022-11-15",
});
export const stripeRouter = createTRPCRouter({
  activateItem: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await stripe.prices
        .update(input.priceId, {
          active: true,
        })
        .then((price) => {
          return price;
        })
        .catch((err) => {
          console.warn(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error activating item",
          });
        });
    }),
  deactivateItem: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await stripe.prices
        .update(input.priceId, {
          active: false,
        })
        .then((price) => {
          return price;
        })
        .catch((err) => {
          console.warn(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error deactivating item",
          });
        });
    }),

  createCustomer: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        phone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await stripe.customers
        .create({
          email: input.email,
          name: input.name,
          phone: input.phone,
        })
        .then((customer) => {
          ctx.prisma.user
            .update({
              data: {
                stripeCustomerId: customer.id,
              },
              where: {
                id: ctx.session.user.id,
              },
            })
            .catch((err) => {
              console.warn(err);
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error updating user",
              });
            });
        })
        .catch((err) => {
          console.warn(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error creating customer",
          });
        });
    }),

  createItem: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await stripe.prices
        .create({
          unit_amount: input.price,
          currency: "usd",
          nickname: input.name,
          product_data: {
            name: input.name,
            statement_descriptor: input.name,
          },
        })
        .then((price) => {
          return price;
        })
        .catch((err) => {
          console.warn(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error creating item",
          });
        });
    }),
  getItems: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        active: z.boolean(),
      })
    )
    .query(async ({ input }) => {
      return await stripe.prices
        .list({
          limit: input.limit,
          active: input.active,
        })
        .then((prices) => {
          return prices.data;
        })
        .catch((err) => {
          console.warn(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error getting items",
          });
        });
    }),
});
