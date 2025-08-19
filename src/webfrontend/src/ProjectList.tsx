import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"
import { ProjectListItem } from "./ProjectListItem"

interface ProjectListProps {
    client: IClient
}

export function ProjectList(props: ProjectListProps) {
    const { client } = props
    const [projects, setProjects] = useState<Project[]|undefined>(undefined)
    if(projects === undefined) {
        client.GetProjects()
        .then(retrievedProjects => setProjects(retrievedProjects))
    }
    return <div data-testid="project-list">
        {projects?.map(p => <ProjectListItem key={p.id} name={p.name} /> )}
    </div>
}