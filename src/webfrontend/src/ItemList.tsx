import { Item } from "./models/Item"
import ItemView from "./ItemView"

interface ItemListProps {
    items?: Item[]
}

export default function ItemList(props: ItemListProps) {
    const { items } = props
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