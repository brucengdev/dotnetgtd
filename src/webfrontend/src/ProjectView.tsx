import { useState } from "react";
import AddProjectForm from "./AddProjectForm";
import { Button } from "./controls/Button";
import { IClient } from "./api/Client";
import { ProjectList } from "./ProjectList";
import { Project } from "./models/Project";

interface ProjectViewProps {
    client: IClient
}

export function ProjectView({ client }: ProjectViewProps) {
    const [showNewProjectForm, setShowNewProjectForm] = useState(false)
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    if(projects === undefined) {
        client.GetProjects()
        .then(retrievedProjects => setProjects(retrievedProjects))
    }
    return <div data-testid="project-view">
        <ProjectList projects={projects || []}/>
        {showNewProjectForm
            ?<AddProjectForm client={client} 
                    onCancel={() => setShowNewProjectForm(false)} 
                    onCompleted={() => {
                        setShowNewProjectForm(false)
                        setProjects(undefined) //set to undefined so projects are reloaded
                    }} />
            :<Button text="Add" onClick={() => setShowNewProjectForm(true)}/>
        }
    </div>
}