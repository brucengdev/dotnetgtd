import { CheckBox } from "./controls/CheckBox";

export interface ProjectFilter {
    active?: boolean
    inactive?: boolean
    uncompleted?: boolean
    completed?: boolean
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
                onChange={checked => props.onChange?.({ ...filter, active: checked })}
             />
            <CheckBox label="Inactive projects" checked={filter.inactive ?? false}
                onChange={checked => props.onChange?.({ ...filter, inactive: checked })}
             />
            
            <CheckBox label="Completed projects" checked={filter.completed ?? false}
                onChange={checked => props.onChange?.({ ...filter, completed: checked })}
             />
            <CheckBox label="Uncompleted projects" checked={filter.uncompleted ?? false}
                onChange={checked => props.onChange?.({ ...filter, uncompleted: checked })}
             />
        </div>
}