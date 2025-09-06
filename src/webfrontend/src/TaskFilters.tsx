import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"
import { Link } from "./controls/Link"
import { CheckBox } from "./controls/CheckBox"

interface TaskFiltersProps {
    client: IClient
}
export function TaskFilters(props: TaskFiltersProps) {
    const { client } = props
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    const [tags, setTags] = useState<Tag[] | undefined>(undefined)
    if(projects === undefined) {
        client.GetProjects()
        .then(retrievedProjects => setProjects(retrievedProjects))
    }
    if(tags === undefined) {
        client.GetTags()
        .then(retrievedTags => setTags(retrievedTags))
    }
    return <div data-testId="task-filters">
        <CheckBox label="All projects" checked={false} />
        <CheckBox label="No project" checked={false} />
        {(projects || []).map(p => <CheckBox key={p.id} label={p.name} checked={false} />)}

        <CheckBox label="All tags" checked={false} />
        <CheckBox label="No tag" checked={false} />
        {(tags || []).map(t => <CheckBox key={t.id} label={t.name} checked={false} />)}
    </div>
}