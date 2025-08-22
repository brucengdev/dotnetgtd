import { Project } from "./models/Project"
import { ProjectListItem } from "./ProjectListItem"

interface ProjectListProps {
    projects: Project[]
}

export function ProjectList(props: ProjectListProps) {
    const { projects } = props
    return <div data-testid="project-list">
        {projects?.map(p => <ProjectListItem key={p.id} name={p.name} /> )}
    </div>
}