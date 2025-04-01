"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });
    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    return { success: false, error: "Failed to create Post" };
  }
}

export async function getPost() {
  try {
   const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments : {
            include : {
                author : {
                    select : {
                        id : true,
                        name : true,
                        username : true,
                        image : true
                    }
                }
            },
            orderBy : {
                createdAt : "asc"
            }
        },
        likes : {
            select : {
                userId : true
            }
        },
        _count : {
            select :{
                likes : true,
                comments : true
            }
        }
      },
    });
    return posts
  } catch (error) {
    console.log("Error in getPosts", error);
    throw new Error("Failed to fetch posts");
  }
}
