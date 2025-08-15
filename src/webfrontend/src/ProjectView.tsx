import { Button } from "./controls/Button";

export function ProjectView() {
    return <div data-testid="project-view">
        <Button text="Add" />
        <div data-testid="add-project-form"></div>
    </div>
}