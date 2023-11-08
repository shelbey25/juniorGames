import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

export const juniorGamesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ctx }) => {
    return ctx.db.juniorGames.findMany({});
  }),
  addEntry: publicProcedure
    .input(
      z.object({
        personCaught: z.string(),
        killer: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { personCaught, killer } = input;
      const modEventInDb = await ctx.db.juniorGames.create({
        data: {
          killer: killer,
          personCaught: personCaught,
          timeCaught: new Date(),
          active: true,
        },
      });
      return { success: true, modEvent: modEventInDb };
    }),
  released: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const modEventInDb = await ctx.db.juniorGames.update({
        where: {
          id: id,
        },
        data: {
          active: false,
        },
      });
      return { success: true, modEvent: modEventInDb };
    }),
    releaseAll: publicProcedure
    .mutation(async ({ ctx }) => {
      const modEventInDb = await ctx.db.juniorGames.updateMany({
        where: {
          active: true,
        },
        data: {
          active: false,
        },
      });
      return { success: true, modEvent: modEventInDb };
    }),
});
