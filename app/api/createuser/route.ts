import prisma, { Prisma } from "@/lib/prisma";
import crypto from "crypto";
interface reqBody {
  username: string;
  password: string;
  todos: string;
  authkey: string;
}

export async function POST(req: Request) {
  const { username, password, authkey }: reqBody = await req.json();
  if (!authkey || authkey !== process.env.NEXT_PUBLIC_AUTHKEY) {
    return new Response(
      JSON.stringify({
        auth: false,
      }),
      {
        status: 401,
      }
    );
  }
  const salt = process.env.SALT || "testSalt";
  const userExists = await prisma.users.findUnique({ where: { username } });
  const status = !userExists;
  if (!status) {
    return new Response(JSON.stringify({ status, hash: "" }));
  }
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  const json = [] as Prisma.JsonArray;
  await prisma.users.create({
    data: {
      username: username,
      password: hash,
      todos: json,
    },
  });
  return new Response(JSON.stringify({ status, hash }));
}
