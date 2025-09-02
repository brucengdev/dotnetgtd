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
                    const projectName = props.projects?.find(p => Number(p.id) == Number(item.projectId))?.name
                    const tags = (item.tagIds ?? []).map(id => tags?.find(t => t.id === id)).filter(t => t !== undefined) as Tag[]
                    const tagNames = tags.map(t => t.name)
                    return <ItemView 
                        description={item.description} 
                        projectName={projectName}
                        tagNames={tagNames}
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