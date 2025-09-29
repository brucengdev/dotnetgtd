import { CheckBox } from "./controls/CheckBox";

export interface ProjectFilter {
    active?: boolean
    uncompleted?: boolean
}

interface ProjectFiltersProps {
    filter?: ProjectFilter
    onChange?: (newFilter: ProjectFilter) => void
}

const defaultFilter: ProjectFilter = {
    active: true,
    uncompleted: true
}

export function ProjectFilters(props: ProjectFiltersProps) {
    const filter = props.filter || defaultFilter
    return <div data-testid="project-filters">
            <CheckBox label="Active projects" checked={filter.active ?? false}
                onChange={_ => props.onChange?.({ ...filter, active: true })}
             />
            <CheckBox label="Inactive projects" checked={false} />
            
            <CheckBox label="Completed projects" checked={false} />
            <CheckBox label="Uncompleted projects" checked={filter.uncompleted ?? false} />
        </div>
}