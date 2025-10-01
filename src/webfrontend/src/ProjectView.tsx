import { useState } from "react";
import AddProjectForm from "./AddProjectForm";
import { Button } from "./controls/Button";
import { IClient } from "./api/Client";
import { ProjectList } from "./ProjectList";
import { Project } from "./models/Project";
import { ProjectFilter, ProjectFilters } from "./ProjectFilters";

const defaultFilter: ProjectFilter = {
    active: true,
    uncompleted: true
}

interface ProjectViewProps {
    client: IClient
}

export function ProjectView({ client }: ProjectViewProps) {
    const [showNewProjectForm, setShowNewProjectForm] = useState(false)
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    const [filter, setFilter] = useState(defaultFilter)
    if(projects === undefined) {
        client.GetProjects(filter)
        .then(retrievedProjects => setProjects(retrievedProjects))
    }
    return <div data-testid="project-view">
        <ProjectFilters filter={filter} 
            onChange={newFilter => {
                setFilter(newFilter)
                setProjects(undefined) //to reload
            }}
         />
        <ProjectList projects={projects || []} 
            onDelete={(projectId) => {
                client.DeleteProject(projectId)
                    .then(() => setProjects(undefined))//to reload project list
            }}
            />
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