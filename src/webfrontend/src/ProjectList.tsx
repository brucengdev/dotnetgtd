import { Project } from "./models/Project"
import { ProjectListItem } from "./ProjectListItem"

interface ProjectListProps {
    projects: Project[]
    onDelete?: (projectId: number) => void
}

export function ProjectList(props: ProjectListProps) {
    const { projects, onDelete } = props
    return <div data-testid="project-list">
        {projects?.map(p => 
            <ProjectListItem key={p.id} 
                name={p.name} 
                later={p.later}
                done={p.done}
                onDelete={() => {
                    if(onDelete) {
                        onDelete(p.id)
                    }
                }
            }
             /> )}
    </div>
}