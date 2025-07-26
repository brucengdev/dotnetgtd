import { useState } from "react"
import { IClient } from "./api/Client"
import { Item } from "./models/Item"
import ItemView from "./ItemView"

interface ItemListProps {
    client: IClient
}

export default function ItemList(props: ItemListProps) {
    const { client } = props
    const [items, setItems] = useState(null as (Item[]|null))
    if(items === null) {
        client.GetItems()
            .then(items => setItems(items))
    }
    const numberOfItems = items?.length ?? 0
    return <div data-testId="item-list">
        {numberOfItems === 0
        ?<div>There are no items.</div>
        :<div>
            {
                items?.map(item => <ItemView description={item.description} />)
            }
        </div>
        }
    </div>
}