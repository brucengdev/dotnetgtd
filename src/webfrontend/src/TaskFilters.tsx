import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"

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
        <a href="#">No project</a>
        {(projects || []).map(p => <a key={p.id} href="#">{p.name}</a>)}

        <a href="#">No tag</a>
        {(tags || []).map(t => <a key={t.id} href="#">{t.name}</a>)}
    </div>
}