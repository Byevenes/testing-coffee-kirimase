import { z } from "zod";

import { createComputer } from "@/lib/api/computers/mutations";
import { getComputers } from "@/lib/api/computers/queries"

import { publicProcedure, router } from "../trpc";

export const computersRouter = router({
  getComputers: publicProcedure.query(async () => {
    return getComputers();
  }),
  createComputer: publicProcedure
    .input(z.object({ brand: z.string(), cores: z.number().default(1) }))
    .mutation(async ({ input }) => {
      return createComputer(input);
    }),
});
