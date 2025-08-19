import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"

interface ProjectListProps {
    client: IClient
}

export function ProjectList(props: ProjectListProps) {
    const { client } = props
    const [projects, setProjects] = useState<Project[]>([])
    client.GetProjects()
    .then(retrievedProjects => setProjects(retrievedProjects))
    return <div data-testid="project-list">
        {projects.map(p => <div data-testid="project">
            <div data-testid="description">{p.name}</div>
        </div>)}
    </div>
}