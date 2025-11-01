import { useState } from "react";
import AddProjectForm from "./AddProjectForm";
import { Button } from "./controls/Button";
import { IClient } from "./api/Client";
import { ProjectList } from "./ProjectList";
import { Project } from "./models/Project";
import { ProjectFilter, ProjectFilters } from "./ProjectFilters";

export const defaultProjectsFilter: ProjectFilter = {
    active: true,
    uncompleted: true
}

interface ProjectViewProps {
    client: IClient,
    filter?: ProjectFilter,
    onFilterChange?: (filter: ProjectFilter) => void
}

export function ProjectView({ client, filter: initialFilter, onFilterChange }: ProjectViewProps) {
    const [showNewProjectForm, setShowNewProjectForm] = useState(false)
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    const [filter, setFilter] = useState(initialFilter || defaultProjectsFilter)
    if(projects === undefined) {
        client.GetProjects(filter)
        .then(retrievedProjects => setProjects(retrievedProjects))
    }
    return <div data-testid="project-view">
        <ProjectFilters filter={filter} 
            onChange={newFilter => {
                setFilter(newFilter)
                setProjects(undefined) //to reload
                onFilterChange?.(newFilter)
            }}
         />
        <div>
            {showNewProjectForm
                ?<AddProjectForm client={client} 
                        onCancel={() => setShowNewProjectForm(false)} 
                        onCompleted={() => {
                            setShowNewProjectForm(false)
                            setProjects(undefined) //set to undefined so projects are reloaded
                        }} />
                :<Button className="mt-2 mb-2" text="Add" onClick={() => setShowNewProjectForm(true)}/>
            }
            <ProjectList projects={projects || []} 
                onDelete={(projectId) => {
                    client.DeleteProject(projectId)
                        .then(() => setProjects(undefined))//to reload project list
                }}
                onChange={(project) => {
                    client.UpdateProject(project)
                        .then(() => setProjects(undefined)) //to reload project list
                }}
            />
        </div>
    </div>
}