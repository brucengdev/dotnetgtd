import { Item } from "./models/Item"
import ItemView from "./ItemView"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"

interface ItemListProps {
    items?: Item[],
    projects?: Project[],
    onDelete?: (_: Item) => void,
    tags?: Tag[]
}

export default function ItemList(props: ItemListProps) {
    const { items, onDelete, tags } = props
    const numberOfItems = items?.length ?? 0
    return <div data-testId="item-list">
        {numberOfItems === 0
        ?<div>There are no items.</div>
        :<div>
            {
                items?.map(item => {
                    return <ItemView 
                        item={item}
                        projects={props.projects ?? []}
                        tags={tags ?? []}
                        onDelete={() => {
                                if(onDelete) { onDelete(item) }
                            }
                        }
                        />
                })
            }
        </div>
        }
    </div>
}