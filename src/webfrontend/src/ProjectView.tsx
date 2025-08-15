import { useState } from "react";
import AddProjectForm from "./AddProjectForm";
import { Button } from "./controls/Button";

export function ProjectView() {
    const [showNewProjectForm, setShowNewProjectForm] = useState(false)
    return <div data-testid="project-view">
        {showNewProjectForm
            ?<AddProjectForm />
            :<Button text="Add" onClick={() => setShowNewProjectForm(true)}/>
        }
    </div>
}