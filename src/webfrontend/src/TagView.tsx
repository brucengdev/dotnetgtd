import { useState } from "react";
import AddTagForm from "./AddTagForm";
import { Button } from "./controls/Button";
import { IClient } from "./api/Client";
import { TagList } from "./TagList";
import { Tag } from "./models/Tag";

interface TagViewProps {
    client: IClient
}

export function TagView({ client }: TagViewProps) {
    const [showNewTagForm, setShowNewTagForm] = useState(false)
    const [Tags, setTags] = useState<Tag[] | undefined>(undefined)
    if(Tags === undefined) {
        client.GetTags()
        .then(retrievedTags => setTags(retrievedTags))
    }
    return <div data-testid="Tag-view">
        <TagList tags={Tags || []} 
            onDelete={(tagId) => {
                client.DeleteTag(tagId)
                    .then(() => setTags(undefined))//to reload Tag list
            }}
            />
        {showNewTagForm
            ?<AddTagForm client={client} 
                    onCancel={() => setShowNewTagForm(false)} 
                    onCompleted={() => {
                        setShowNewTagForm(false)
                        setTags(undefined) //set to undefined so Tags are reloaded
                    }} />
            :<Button text="Add" onClick={() => setShowNewTagForm(true)}/>
        }
    </div>
}