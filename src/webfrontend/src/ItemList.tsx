import { Item } from "./models/Item"
import ItemView from "./ItemView"
import { Project } from "./models/Project"

interface ItemListProps {
    items?: Item[],
    projects?: Project[],
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
                    projectName={props.projects?.find(p => p.id === item.projectId)?.name}
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