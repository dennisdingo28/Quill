import prismadb from '@/db';
import { privateProcedure, publicProcedure, router } from './trpc';
 import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import {TRPCError} from "@trpc/server";
import z from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async ()=>{
    const {getUser} = getKindeServerSession();
    const user = getUser();
    if(!user.id || !user.email)
      throw new TRPCError({code:"UNAUTHORIZED"});

    const dbUser = await prismadb.user.findFirst({
      where:{
        id:user.id,
      },
    });

    if(!dbUser){
      await prismadb.user.create({
        data:{
          id:user.id,
          email:user.email,
        }
      })
    }
    return {success:true};
  }),
  getUserFiles: privateProcedure.query(async ({ctx})=>{
    const {userId, user} = ctx;
    return await prismadb.file.findMany({
      where:{
        userId:userId,
      },
    });
  }),
  deleteFile: privateProcedure.input(z.object({id: z.string(),})).mutation(async ({ctx, input})=>{
    const {userId, user} = ctx;
    const file = await prismadb.file.findFirst({
      where:{
        id:input.id,
        userId:userId,
      },
    });

    if(!file) throw new TRPCError({code:"NOT_FOUND"});

    await prismadb.file.delete({
      where:{
        id:input.id,
        userId:userId,
      },
    });

    return file;
  }),
});
 

export type AppRouter = typeof appRouter;