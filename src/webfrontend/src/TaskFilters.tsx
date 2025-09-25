import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"
import { CheckBox } from "./controls/CheckBox"
import { isAnIntId } from "./utils"

export interface Filter {
    completed?: boolean
    uncompleted?: boolean
    active?: boolean
    inactive?: boolean
    projectIds?: string[]
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

    function buildProjectIdsFilter(projectId: number, projectSelected: boolean)
        : string[] | undefined {
        if(filter?.projectIds === undefined || filter?.projectIds?.includes("nonnull")) {
            //all were selected, now one is being unselected
            if(projectSelected === true) {
                return [projectId.toString()]
            }
        }
        if(projectSelected) {
            let result = [...(filter?.projectIds || []), projectId.toString()]
                .filter(pId => pId !== "nonnull")
            const numberOfProjects = result.filter(pId => isAnIntId(pId)).length
            if(numberOfProjects === (projects?.length ?? 0))//all projects are selected
            {
                result = result.filter(pId => !isAnIntId(pId)).concat("nonnull")
            }
            return result
        } else {
            return [...(filter?.projectIds || [])].filter(x => x !== projectId.toString())
        }
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

        <CheckBox label="All projects" 
            checked={
                filter?.projectIds === undefined
                || filter?.projectIds?.includes("nonnull")
            }
            onChange={newValue => {
                let newProjectIds = [...filter?.projectIds??[]]
                if(newValue) {
                    newProjectIds.push("nonnull")
                    newProjectIds = newProjectIds.filter(pId => !isAnIntId(pId))
                } else {
                    //remove all project filters accept "null" (for tasks with no project)
                    newProjectIds = newProjectIds.filter(pId => pId !== "nonnull" && !isAnIntId(pId))
                }
                executeFilterChangeCallback(props, { ...filter, projectIds: newProjectIds})
            }} />
        <CheckBox label="No project" checked={
                filter?.projectIds?.includes("null") 
                || false 
            }
            onChange={(newValue) => 
                {
                    let newProjectIds = [...filter?.projectIds??[]]
                    if(newValue && !newProjectIds.includes("null")) {
                        newProjectIds.push("null")
                    } else {
                        newProjectIds = newProjectIds.filter(pId => pId !== "null")
                    }
                    executeFilterChangeCallback(props, { ...filter, projectIds: newProjectIds })
                }
            }
        />

        {(projects || []).map(p => 
            <CheckBox key={p.id} label={p.name} 
                checked={
                        filter?.projectIds === undefined 
                        || filter?.projectIds?.includes(p.id.toString()) 
                        || filter?.projectIds?.includes("nonnull")
                        || false
                    } 
                onChange={(newValue) => {
                    executeFilterChangeCallback(props, { ...filter, projectIds: buildProjectIdsFilter(p.id, newValue) })
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

