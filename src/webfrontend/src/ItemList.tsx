import { useState } from "react"
import { IClient } from "./api/Client"
import { Item } from "./models/Item"
import ItemView from "./ItemView"

interface ItemListProps {
    client: IClient
}

export default function ItemList(props: ItemListProps) {
    const { client } = props
    const [items, setItems] = useState([] as Item[])
    client.GetItems()
    .then(items => setItems(items))
    return <div data-testId="item-list">
        {items.length === 0
        ?<div>There are no items.</div>
        :<div>
            {
                items.map(item => <ItemView description={item.description} />)
            }
        </div>
        }
    </div>
}