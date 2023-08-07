import prisma from "@/lib/prisma";

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
  if (!username || !password) {
    return new Response(JSON.stringify({ redirect: true }));
  }
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
  });
  if (!user) {
    return new Response(JSON.stringify({ redirect: true }));
  }
  return new Response(JSON.stringify({ redirect: user.password !== password }));
}
