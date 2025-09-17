import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"
import { CheckBox } from "./controls/CheckBox"

export interface Filter {
    completed?: boolean
    uncompleted?: boolean
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
        <CheckBox label="Active tasks" checked={false} />
        <CheckBox label="Inactive tasks" checked={false} />

        <CheckBox label="Completed tasks" checked={filter?.completed?? false}
            onChange={(newValue) => {
                if(props.onFiltersChanged) {
                    props.onFiltersChanged({ ...filter, completed: newValue })
                }
            }}
         />
        <CheckBox label="Uncompleted tasks" checked={filter?.uncompleted ?? false} 
            onChange={(newValue) => {
                if(props.onFiltersChanged) {
                    props.onFiltersChanged({ ...filter, uncompleted: newValue })
                }
            }}
        />

        <CheckBox label="All projects" checked={false} />
        <CheckBox label="No project" checked={false} />
        {(projects || []).map(p => <CheckBox key={p.id} label={p.name} checked={false} />)}

        <CheckBox label="All tags" checked={false} />
        <CheckBox label="No tag" checked={false} />
        {(tags || []).map(t => <CheckBox key={t.id} label={t.name} checked={false} />)}
    </div>
}