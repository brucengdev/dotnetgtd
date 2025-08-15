import AddProjectForm from "./AddProjectForm";
import { Button } from "./controls/Button";

export function ProjectView() {
    return <div data-testid="project-view">
        <Button text="Add" />
        <AddProjectForm />
    </div>
}