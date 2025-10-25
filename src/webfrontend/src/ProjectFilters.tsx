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

export function ProjectFilters(props: ProjectFiltersProps) {
    const filter = props.filter
    return <div data-testid="project-filters" className="pt-5">
            <CheckBox label="Active projects" checked={filter?.active ?? false}
                onChange={checked => props.onChange?.({ ...filter, active: checked })}
            />
            <CheckBox label="Inactive projects" checked={filter?.inactive ?? false}
                onChange={checked => props.onChange?.({ ...filter, inactive: checked })}
            />

            <hr />

            <CheckBox label="Completed projects" checked={filter?.completed ?? false}
                onChange={checked => props.onChange?.({ ...filter, completed: checked })}
            />
            <CheckBox label="Uncompleted projects" checked={filter?.uncompleted ?? false}
                onChange={checked => props.onChange?.({ ...filter, uncompleted: checked })}
            />
        </div>
}