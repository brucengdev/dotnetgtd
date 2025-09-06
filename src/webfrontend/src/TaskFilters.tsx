import { IClient } from "./api/Client"

interface TaskFiltersProps {
    client: IClient
}
export function TaskFilters(props: TaskFiltersProps) {
    return <div data-testId="task-filters">
        <a href="#">No project</a>
    </div>
}