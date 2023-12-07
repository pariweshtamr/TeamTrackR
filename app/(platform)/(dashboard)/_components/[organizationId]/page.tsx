import db from "@/lib/db"
import Form from "./_components/form"

const OrganizationIdPage = async () => {
  const boards = await db.board.findMany()
  return (
    <div className="flex flex-col space-y-4">
      <Form />
      <div className="space-y-2">
        {boards.map((board) => (
          <div className="" key={board.id}>
            Board Title: {board.title}
          </div>
        ))}
      </div>
    </div>
  )
}
export default OrganizationIdPage
