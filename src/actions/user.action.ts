"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser(); 

    if (!userId || !user) return null;

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (dbUser) return dbUser;

    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error syncing user:", error); 
    return null;
  }
}

export async function getUserByClerId(clerkId:string) {
  return prisma.user.findUnique({
    where : {
      clerkId,
    },
    include : {
      _count : {
        select : {
          followers : true,
          following : true,
          posts : true
        }
      }
    }
  })
}

export async function getDbUserId() {
  const {userId : clerkId} = await auth();
  if(!clerkId) throw new Error("UnAuthorised");

  const user = await getUserByClerId(clerkId);
  if(!user) throw new Error("User Not Found");

  return user.id;
}
