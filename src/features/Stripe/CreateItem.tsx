import { useState } from "react"
import { api } from "../../utils/api"

const CreateItem = ({ refetchCallback, closeWindowCallback }: { refetchCallback: () => Promise<void>, closeWindowCallback: (close: boolean) => void }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const setPriceHandler = (value: string) => {
    setPrice(parseInt(value))
  }
  const { mutate: createItem, isLoading } = api.stripe.createItem.useMutation({
    onSuccess: async () => {
      setName("")
      setDescription("")
      setPrice(0)
      await refetchCallback()
    }
  })
  const submitHandler = () => {
    if (name && description && price) {
      createItem({ name, description, price })
      closeWindowCallback(false)
    }
  }
  const submitMoreHandler = () => {
    if (name && description && price) {
      createItem({ name, description, price })
    }
  }
  return (
    <div className="container flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Create Item</h1>
      <div className="flex flex-row justify-evenly w-full">
        <div className="flex flex-col text-white">
          <label>Name</label>
          <input className="bg-slate-800 rounded-md p-1"
            value={name} onChange={(e) => setName(e.target.value)}
            autoComplete={"no"}></input>
          <label>Description</label>
          <input className="bg-slate-800 rounded-md p-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete={"no"}></input>
          <label>Price</label>
          <input className="bg-slate-800 rounded-md p-1"
            onChange={(e) => setPriceHandler(e.target.value)}
            value={price}
            autoComplete={"no"}
            type={"text"}></input>
        </div>
        <div className="flex flex-col justify-evenly">
          <button className="bg-white rounded-md border-black border text-black hover:bg-black hover:text-white ease-in-out duration-300 hover:border-white p-1"
            onClick={submitHandler}
            disabled={isLoading}>
            Submit
          </button>
          <button className="bg-white rounded-md border-black border text-black hover:bg-black hover:text-white ease-in-out duration-300 hover:border-white p-1"
            onClick={submitMoreHandler}
            disabled={isLoading}>
            Submit More
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateItem