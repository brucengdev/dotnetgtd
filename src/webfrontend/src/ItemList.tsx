import { Item } from "./models/Item"
import ItemView from "./ItemView"

interface ItemListProps {
    items?: Item[],
    onDelete?: (_: Item) => void
}

export default function ItemList(props: ItemListProps) {
    const { items, onDelete } = props
    const numberOfItems = items?.length ?? 0
    return <div data-testId="item-list">
        {numberOfItems === 0
        ?<div>There are no items.</div>
        :<div>
            {
                items?.map(item => <ItemView 
                    description={item.description} 
                    onDelete={() => {
                            if(onDelete) { onDelete(item) }
                        }
                    }
                    />)
            }
        </div>
        }
    </div>
}