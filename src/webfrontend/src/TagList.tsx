import { Tag } from "./models/Tag"
import { TagListItem } from "./TagListItem"

interface TagListProps {
    tags: Tag[]
    onDelete?: (tagId: number) => void
}

export function TagList(props: TagListProps) {
    const { tags, onDelete } = props
    return <div data-testid="tag-list">
        {tags?.map(p => 
            <TagListItem key={p.id} name={p.name}
                onDelete={() => {
                    if(onDelete) {
                        onDelete(p.id)
                    }
                }
            }
             /> )}
    </div>
}