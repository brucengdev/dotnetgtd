import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"
import { Link } from "./controls/Link"

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
        <Link text="No project" />
        {(projects || []).map(p => <Link key={p.id} text={p.name} />)}

        <Link text="No tag" />
        {(tags || []).map(t => <Link key={t.id} text={t.name} />)}
    </div>
}