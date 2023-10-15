import prismadb from "@/db";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = getUser();

  const { id: userId } = user;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  //validating the payload
  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await prismadb.file.findFirst({
    where: {
      id: fileId,
      userId: userId,
    },
  });

  if (!file) return new Response("Not Found", { status: 404 });

  await prismadb.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });
}
