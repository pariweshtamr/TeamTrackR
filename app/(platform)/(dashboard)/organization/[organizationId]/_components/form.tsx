"use client"
import { createBoard } from "@/actions/create-board"
import FormInput from "@/components/form/form-input"
import FormSubmit from "@/components/form/form-submit"
import { useAction } from "@/hooks/useAction"

const Form = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => console.log("success", data),
    onError: (error) => console.log("error", error),
  })
  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string

    execute({ title, image: "" })
  }
  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput errors={fieldErrors} id="title" label="Board Title" />
      </div>

      <FormSubmit variant="primary">Save</FormSubmit>
    </form>
  )
}
export default Form
