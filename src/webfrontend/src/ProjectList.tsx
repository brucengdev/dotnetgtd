import { Project } from "./models/Project"
import { ProjectListItem } from "./ProjectListItem"

interface ProjectListProps {
    projects: Project[]
    onDelete?: (projectId: number) => void
    onChange?: (project: Project) => void
}

export function ProjectList(props: ProjectListProps) {
    const { projects, onDelete, onChange } = props
    return <div data-testid="project-list">
        {projects?.sort((a, b) => a.name.localeCompare(b.name))
            .map(p => 
            <ProjectListItem key={p.id} 
                project={p}
                onDelete={() => {
                    if(onDelete) {
                        onDelete(p.id)
                    }
                }}
                onChange={project => {
                    if(onChange) {
                        onChange(project)
                    }
                }}
             /> )}
    </div>
}