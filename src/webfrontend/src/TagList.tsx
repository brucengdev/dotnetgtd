import { Tag } from "./models/Tag"
import { TagListItem } from "./TagListItem"

interface TagListProps {
    tags: Tag[]
    onDelete?: (tagId: number) => void
    onChange?: (tag: Tag) => void
}

export function TagList(props: TagListProps) {
    const { tags, onDelete } = props
    return <div data-testid="tag-list">
        {tags?.map(t => 
            <TagListItem key={t.id} tag={{id: t.id, name: t.name}}
                onDelete={() => {
                    if(onDelete) {
                        onDelete(t.id)
                    }
                }
            }
             /> )}
    </div>
}