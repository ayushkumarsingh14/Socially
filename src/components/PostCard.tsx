"use client"

import { getPost } from "@/actions/post.action";
import { useUser } from "@clerk/nextjs"
import { flushAllTraces } from "next/dist/trace";
import { useState } from "react";

type Posts = Awaited<ReturnType<typeof getPost>>;
type Post = Posts[number]

async function PostCard({post, dbUserId} : {post:Post, dbUserId:string | null}){ 
  const { user } = useUser();
  const [newComment, setNewComment] = useState("")
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false)
  const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === dbUserId));
  const [isDeleting, setIsDeleting] = useState(false)
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes)
  const [showComments, setShowComments] = useState(false)

   const handliLike = async () => {
    if(isLiking) return

    try {
      setIsLiking(true)
      setHasLiked((prev) => !prev)
      setOptmisticLikes((prev) => prev + (hasLiked? -1 : 1))
      // await toggleLike(post.id)
    } catch (error) {
      setOptmisticLikes(post._count.likes)
      setHasLiked(post.likes.some((like) => like.userId === dbUserId) )
    }finally {
      setIsLiking(false)
    }
  };

  return (
    <div>PostCard</div>
  )
}

export default PostCard