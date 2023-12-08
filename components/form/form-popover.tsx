"use client"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import FormInput from "./form-input"
import FormSubmit from "./form-submit"
import { useAction } from "@/hooks/useAction"
import { createBoard } from "@/actions/create-board"
import { toast } from "sonner"

type FormPopOverProps = {
  children: React.ReactNode
  side?: "left" | "right" | "top" | "bottom"
  align?: "start" | "center" | "end"
  sideOffset?: number
}

const FormPopOver = ({
  children,
  side,
  align,
  sideOffset,
}: FormPopOverProps) => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success("Board created!")
    },
    onError: (error) => {
      toast.error(error)
    },
  })

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string

    execute({ title })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center pb-4 text-neutral-600">
          Create board
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant={"ghost"}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <form action={onSubmit} className="space-y-4">
          <div className="spacce-y-4">
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>

          <FormSubmit className="w-full" variant="primary">
            Create
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}
export default FormPopOver