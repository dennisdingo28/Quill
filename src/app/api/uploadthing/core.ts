import prismadb from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
 
export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
        
        const {getUser} = getKindeServerSession();
        const user = getUser();
        if(!user || !user.id)
            throw new Error("UNAUTHORIZED");
 
      return {userId: user.id};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await prismadb.file.create({
        data:{
          key:file.key,
          userId:metadata.userId,
          name:file.name,
          url:`https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus:"PROCESSING",
        },
      });
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;