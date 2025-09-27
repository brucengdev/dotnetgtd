import { CheckBox } from "./controls/CheckBox";

export function ProjectFilters() {
    return <div data-testid="project-filters">
            <CheckBox label="Active projects" checked={false} />
            <CheckBox label="Inactive projects" checked={false} />
            
            <CheckBox label="Completed projects" checked={false} />
            <CheckBox label="Uncompleted projects" checked={false} />
        </div>
}