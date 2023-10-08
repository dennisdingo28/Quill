import prismadb from '@/db';
import { privateProcedure, publicProcedure, router } from './trpc';
 import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import {TRPCError} from "@trpc/server";

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
  })
});
 

export type AppRouter = typeof appRouter;