import { Item } from "./models/Item"
import ItemView from "./ItemView"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"

interface ItemListProps {
    items?: Item[],
    projects?: Project[],
    onDelete?: (_: Item) => void,
    onUpdate?: (_: Item) => void,
    tags?: Tag[]
}

export default function ItemList(props: ItemListProps) {
    const { items, onDelete, onUpdate, tags } = props
    const numberOfItems = items?.length ?? 0
    const sortedItems = items?.sort((a, b) => {
        const aTags = a.tagIds ?? []
        const bTags = b.tagIds ?? []
        if(aTags.length > 0 && bTags.length === 0) {
            return -1
        }
        if(aTags.length === 0 && bTags.length > 0) {
            return 1
        }
        return a.description.localeCompare(b.description)
    }) ?? []
    return <div data-testId="item-list">
        {numberOfItems === 0
        ?<div>There are no items.</div>
        :<div>
            {
                sortedItems
                .map(item => {
                    return <ItemView
                        key={item.id}
                        item={item}
                        projects={props.projects ?? []}
                        tags={tags ?? []}
                        onDelete={() => {
                                if(onDelete) { onDelete(item) }
                            }
                        }
                        onChange={(updatedItem) => {
                            if(onUpdate) { onUpdate(updatedItem) }
                        }}
                    />
                })
            }
        </div>
        }
    </div>
}