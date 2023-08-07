import prisma from "@/lib/prisma";
import crypto from "crypto";

interface reqBody {
  username: string;
  password: string;
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
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return new Response(JSON.stringify({ status: false, hash: "" }));
  }
  const salt = process.env.SALT || "testSalt";
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return new Response(
    JSON.stringify({
      status: crypto.timingSafeEqual(
        Buffer.from(hash, "hex"),
        Buffer.from(user.password, "hex")
      ),
      hash,
    })
  );
}
