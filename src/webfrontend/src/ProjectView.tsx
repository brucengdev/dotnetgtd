import { useState } from "react";
import AddProjectForm from "./AddProjectForm";
import { Button } from "./controls/Button";
import { IClient } from "./api/Client";

interface ProjectViewProps {
    client: IClient
}

export function ProjectView({ client }: ProjectViewProps) {
    const [showNewProjectForm, setShowNewProjectForm] = useState(false)
    return <div data-testid="project-view">
        {showNewProjectForm
            ?<AddProjectForm client={client} onCancel={() => setShowNewProjectForm(false)} />
            :<Button text="Add" onClick={() => setShowNewProjectForm(true)}/>
        }
    </div>
}