"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeAction } from "@/lib/create-safe-action"
import { CopyList } from "./schema"
import { Card } from "@prisma/client"

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    return {
      error: "Unauthorized!",
    }
  }

  const { id, boardId } = data
  let list

  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      include: {
        cards: true,
      },
    })

    if (!listToCopy) {
      return {
        error: "List not found!",
      }
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
      select: { position: true },
    })

    const newPosition = lastList ? lastList.position + 1 : 1

    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        position: newPosition,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card: Card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    })
  } catch (error) {
    return {
      error: "Failed to copy list!",
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: list }
}

export const copyList = createSafeAction(CopyList, handler)
