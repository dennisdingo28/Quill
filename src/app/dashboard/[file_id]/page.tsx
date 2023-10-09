import prismadb from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps{
    params:{
        file_id: string;
    },
}

const Page = async ({params}:PageProps) => {
    const {file_id} = params;

    const {getUser} = getKindeServerSession();
    const user = getUser();

    if(!user || !user.id) redirect(`/auth-callback?origin=dashboard/${file_id}`);

    const file = await prismadb.file.findFirst({
        where:{
            id:file_id,
            userId:user.id,
        },
    });

    if(!file) notFound();

    return (
        <div>Page: {file_id}</div>
    )
}

export default Page