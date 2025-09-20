import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"
import { CheckBox } from "./controls/CheckBox"

export interface Filter {
    completed?: boolean
    uncompleted?: boolean
    active?: boolean
    inactive?: boolean
    projectIds?: (number | undefined)[]
}

interface TaskFiltersProps {
    client: IClient
    filter?: Filter
    onFiltersChanged?: (filter: Filter) => void
}
export function TaskFilters(props: TaskFiltersProps) {
    const { client, filter } = props
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    const [tags, setTags] = useState<Tag[] | undefined>(undefined)
    if(projects === undefined) {
        client.GetProjects()
        .then(retrievedProjects => setProjects(retrievedProjects))
    }
    if(tags === undefined) {
        client.GetTags()
        .then(retrievedTags => setTags(retrievedTags))
    }

    return <div data-testId="task-filters">
        <CheckBox label="Active tasks" checked={filter?.active ?? false}
            onChange={(newValue) =>
                executeFilterChangeCallback(props, { ...filter, active: newValue })} 
        />
        <CheckBox label="Inactive tasks" checked={filter?.inactive ?? false} 
            onChange={(newValue) =>
                executeFilterChangeCallback(props, { ...filter, inactive: newValue })} 
        />

        <CheckBox label="Completed tasks" checked={filter?.completed?? false}
            onChange={(newValue) => 
                executeFilterChangeCallback(props, { ...filter, completed: newValue })}
         />
        <CheckBox label="Uncompleted tasks" checked={filter?.uncompleted ?? false} 
            onChange={(newValue) =>
                executeFilterChangeCallback(props, { ...filter, uncompleted: newValue })}
        />

        <CheckBox label="All projects" checked={filter?.projectIds === undefined} />
        <CheckBox label="No project" checked={filter?.projectIds?.length === 0} 
            onChange={(newValue) => 
                executeFilterChangeCallback(props, { ...filter, projectIds: buildProjectIdsFilter(filter?.projectIds, undefined, newValue) })}
        />

        {(projects || []).map(p => 
            <CheckBox key={p.id} label={p.name} 
                checked={filter?.projectIds === undefined || filter?.projectIds?.includes(p.id) || false} 
                onChange={(newValue) => {
                    executeFilterChangeCallback(props, { ...filter, projectIds: buildProjectIdsFilter(filter?.projectIds, p.id, newValue) })
                }}
            />
        )}

        <CheckBox label="All tags" checked={false} />
        <CheckBox label="No tag" checked={false} />
        {(tags || []).map(t => <CheckBox key={t.id} label={t.name} checked={false} />)}
    </div>
}

function executeFilterChangeCallback(props: TaskFiltersProps, newFilter: Filter) {
    if(props.onFiltersChanged) {
        props.onFiltersChanged(newFilter)
    }
}

function buildProjectIdsFilter(currentProjectIds: (number | undefined)[] | undefined, projectId: number | undefined, projectSelected: boolean)
    : (number | undefined)[] | undefined {
    if(currentProjectIds === undefined) {
        //all were selected, now one is being unselected
        if(projectSelected === true) {
            return [projectId]
        }
    }
    if(projectSelected) {
        return [...(currentProjectIds || []), projectId]
    } else {
        return [...(currentProjectIds || [])].filter(x => x !== projectId)
    }
}