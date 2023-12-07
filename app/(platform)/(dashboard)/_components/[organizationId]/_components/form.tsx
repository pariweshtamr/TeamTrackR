"use client"
import { createBoard } from "@/actions/create-board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAction } from "@/hooks/useAction"

const Form = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => console.log("success", data),
    onError: (error) => console.log("error", error),
  })
  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string

    execute({ title })
  }
  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <Input
          type="text"
          id="title"
          name="title"
          required
          placeholder="Enter a board title"
        />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
export default Form
