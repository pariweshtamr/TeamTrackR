"use client"

import { ListWithCards } from "@/types"
import { ListForm } from "./list-form"
import { useEffect, useState } from "react"
import { ListItem } from "./list-item"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useAction } from "@/hooks/useAction"
import { updateListOrder } from "@/actions/update-list-order"
import { toast } from "sonner"
import { updateCardOrder } from "@/actions/update-card-order"

type ListContainerProps = {
  data: ListWithCards[]
  boardId: string
}

function reOrder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}
export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data)
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("Lists reordered!")
    },
    onError: (error) => {
      toast.error(error)
    },
  })
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Cards reordered!")
    },
    onError: (error) => {
      toast.error(error)
    },
  })

  useEffect(() => {
    setOrderedData(data)
  }, [data])

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result
    if (!destination) return

    // if Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    // if user moves a list
    if (type === "list") {
      const items = reOrder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, position: index })
      )
      setOrderedData(items)

      // Trigger server action
      executeUpdateListOrder({ items, boardId })
    }

    // if user moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData]

      // source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      )
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      )

      if (!sourceList || !destList) return

      // check if cards exist on source list
      if (!sourceList.cards) {
        sourceList.cards = []
      }
      // check if cards exist on destination list
      if (!destList.cards) {
        destList.cards = []
      }

      // if user moves card in the same list
      if (source.droppableId === destination.droppableId) {
        const reOrderedCards = reOrder(
          sourceList.cards,
          source.index,
          destination.index
        )

        reOrderedCards.forEach((card, i) => {
          card.order = i
        })

        sourceList.cards = reOrderedCards

        setOrderedData(newOrderedData)

        // trigger server action to save order in db
        executeUpdateCardOrder({ items: reOrderedCards, boardId })
      } else {
        // if user moves card to another list

        // Remove card from source list
        const [movedCard] = sourceList.cards.splice(source.index, 1)

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard)

        // update the order for each card in source list
        sourceList.cards.forEach((card, idx) => {
          card.order = idx
        })

        // update the order for each card in destination list
        destList.cards.forEach((card, idx) => {
          card.order = idx
        })
        setOrderedData(newOrderedData)

        // trigger server action to save order in db
        executeUpdateCardOrder({ items: destList.cards, boardId })
      }
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, i) => (
              <ListItem key={list.id} index={i} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}
