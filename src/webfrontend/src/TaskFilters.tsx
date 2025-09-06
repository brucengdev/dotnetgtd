import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"

interface TaskFiltersProps {
    client: IClient
}
export function TaskFilters(props: TaskFiltersProps) {
    const { client } = props
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    if(projects === undefined) {
        client.GetProjects()
        .then(retrievedProjects => setProjects(retrievedProjects))
    }
    return <div data-testId="task-filters">
        <a href="#">No project</a>
        {(projects || []).map(p => <a key={p.id} href="#">{p.name}</a>)}
        
        <a href="#">No tag</a>
    </div>
}