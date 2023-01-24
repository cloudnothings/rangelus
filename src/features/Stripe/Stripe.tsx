import { api } from "../../utils/api";
import { Stripe } from "stripe";
import { useState } from "react";
import CreateItem from "./CreateItem";
const StripePage = () => {
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const { data: products, refetch: refetchItems } = api.stripe.getItems.useQuery({ limit: 10, active: !showAllItems }, {
    initialData: [],
  })

  return (
    <div className="container flex flex-col justify-center text-white bg-gray-900 items-center p-2 gap-8 rounded-md mt-4 w-11/12">
      <div className="flex flex-row justify-between w-full">
        <div className="text-3xl font-bold">Store</div>
        <button onClick={() => setShowCreateItem(!showCreateItem)} className='rounded-md bg-white/10 p-2 font-semibold text-white no-underline transition hover:bg-white/20'>
          Create Item
        </button>
      </div>
      {showCreateItem && <CreateItem refetchCallback={refetchItems} closeWindowCallback={setShowCreateItem} />}
      <div className="mt-8 flex flex-col gap-2 w-full">
        <div className="self-end pr-2">
          <button className="bg-blue-600 p-2 rounded-md text-white font-bold hover:bg-blue-500 active:bg-blue-600"
            onClick={() => setShowAllItems(!showAllItems)}
          >{showAllItems ? 'Show Active Items' : 'Show Inactive Items'}</button>
        </div>
        {products.map(product => <Product key={product.id} {...product} />)}
      </div>
    </div >
  )
}
const Product = (price: Stripe.Price) => {
  const { mutateAsync: deactivateItem, isSuccess: deactivateSuccessful } = api.stripe.deactivateItem.useMutation()
  const deactivateItemHandler = () => {
    deactivateItem({ priceId: price.id })
  }
  const { mutateAsync: activateItem, isSuccess: activateSuccessful } = api.stripe.activateItem.useMutation()
  const activateItemHandler = () => {
    activateItem({ priceId: price.id })
  }
  if (deactivateSuccessful) {
    // rerender the component
    return <></>
  }
  if (activateSuccessful) {
    return <></>
  }
  return (
    <div className="container flex justify-between border rounded-md">
      <div className="flex flex-row p-2 gap-2 justify-start h-32">
        <div className="flex flex-col justify-between items-start">
          <h1 className="text-2xl font-bold">{price.nickname}</h1>
          <p className="container text-md">{price.id}</p>
          <p className="text-lg font-bold">${price.unit_amount}</p>
          <div>{price.active ? 'Active' : 'Inactive'}</div>
        </div>
      </div>
      <div className="flex flex-col justify-evenly p-2">
        {price.active ? (
          <>
            <button className="bg-blue-600 p-2 rounded-md text-sm text-white font-bold hover:bg-blue-500 active:bg-blue-600"
            >Add to Cart</button>
            <button className="bg-red-600 p-2 rounded-md text-sm text-white font-bold hover:bg-red-500 active:bg-red-600"
              onClick={deactivateItemHandler}
            >Deactivate Item</button>
          </>
        ) : (
          <button className="bg-green-600 p-2 rounded-md text-sm text-white font-bold hover:bg-green-500 active:bg-green-600"
            onClick={activateItemHandler}
          >Activate Item</button>
        )}
      </div>
    </div >
  )
}


export default StripePage