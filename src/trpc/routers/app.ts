import { createTRPCRouter, publicProcedure } from '../init';

import { z } from 'zod';

export const appRouter = createTRPCRouter({
    hello: publicProcedure
        .input(
            z.object({
                text: z.string(),
            })
        )
        .query((opts) => {
            console.log(opts.ctx);
            return {
                greeting: `hello ${opts.input.text}`,
            };
        }),
});

export type AppRouter = typeof appRouter;
