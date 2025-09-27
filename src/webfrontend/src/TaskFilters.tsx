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
    tagIds?: string[]
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
            if(projectSelected === false) {
                return [...filter?.projectIds?? [], ...(projects?.map(p => p.id.toString()) ?? [])]
                    .filter(pId => pId !== "nonnull" && pId !== projectId.toString())
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
            onChange={(selected) =>
                executeFilterChangeCallback(props, { ...filter, active: selected })} 
        />
        <CheckBox label="Inactive tasks" checked={filter?.inactive ?? false} 
            onChange={(selected) =>
                executeFilterChangeCallback(props, { ...filter, inactive: selected })} 
        />

        <CheckBox label="Completed tasks" checked={filter?.completed?? false}
            onChange={(selected) => 
                executeFilterChangeCallback(props, { ...filter, completed: selected })}
         />
        <CheckBox label="Uncompleted tasks" checked={filter?.uncompleted ?? false} 
            onChange={(selected) =>
                executeFilterChangeCallback(props, { ...filter, uncompleted: selected })}
        />

        <CheckBox label="All projects" 
            checked={
                filter?.projectIds === undefined
                || filter?.projectIds?.includes("nonnull")
            }
            onChange={selected => {
                let newProjectFilters = [...filter?.projectIds??[]]
                if(selected) {
                    newProjectFilters.push("nonnull")
                    newProjectFilters = newProjectFilters.filter(pId => !isAnIntId(pId))
                } else {
                    //remove all project filters accept "null" (for tasks with no project)
                    newProjectFilters = newProjectFilters.filter(pId => pId !== "nonnull" && !isAnIntId(pId))
                }
                executeFilterChangeCallback(props, { ...filter, projectIds: newProjectFilters})
            }} />
        
        {(projects || []).map(p => 
            <CheckBox key={p.id} label={p.name} 
                checked={
                        filter?.projectIds === undefined 
                        || filter?.projectIds?.includes(p.id.toString()) 
                        || filter?.projectIds?.includes("nonnull")
                        || false
                    } 
                onChange={(selected) => {
                    executeFilterChangeCallback(props, { ...filter, projectIds: buildProjectIdsFilter(p.id, selected) })
                }}
        />
        )}

        <CheckBox label="No project" checked={
                filter?.projectIds?.includes("null") 
                || false 
            }
            onChange={(selected) => 
                {
                    let newProjectFilters = [...filter?.projectIds??[]]
                    if(selected && !newProjectFilters.includes("null")) {
                        newProjectFilters.push("null")
                    } else {
                        newProjectFilters = newProjectFilters.filter(pId => pId !== "null")
                    }
                    executeFilterChangeCallback(props, { ...filter, projectIds: newProjectFilters })
                }
            }
        />

        <CheckBox label="All tags" 
            checked={filter?.tagIds?.includes("nonnull") ?? false} 
            onChange={selected => {
                let newTagFilters = [...(filter?.tagIds ?? [])]
                if(selected) {
                    newTagFilters.push("nonnull")
                    newTagFilters = newTagFilters.filter(tId => !isAnIntId(tId))
                } else {
                    newTagFilters = newTagFilters.filter(tId => tId !== "nonnull")
                }
                executeFilterChangeCallback(props, {...filter, tagIds: newTagFilters})
            }}
        />
        {(tags || []).map(t => 
            <CheckBox key={t.id} label={t.name} 
                checked={filter?.tagIds?.includes(t.id.toString()) 
                    || filter?.tagIds?.includes("nonnull")
                    || false
                }
                onChange={selected => {
                    let newTagFilters = [...(filter?.tagIds ?? [])]
                    if(selected) {
                        newTagFilters.push(t.id.toString())

                        const tagIds = newTagFilters.filter(tId => isAnIntId(tId))
                        if(tagIds.length === (tags?.length ?? 0)) {
                            //all tags are selected
                            newTagFilters.push("nonnull")
                            newTagFilters = newTagFilters.filter(tId => !isAnIntId(tId))
                        }
                    } else {
                        if(newTagFilters.includes("nonnull")) {
                            const otherTagIds = tags?.map(t => t.id.toString())
                                .filter(tagId => tagId !== t.id.toString()) ?? []
                            newTagFilters = newTagFilters
                                            .filter(tId => tId !== "nonnull")
                                            .concat(otherTagIds)
                        } else {
                            newTagFilters = newTagFilters.filter(tId => tId !== t.id.toString())
                        }
                    }
                    executeFilterChangeCallback(props, {... filter, tagIds: newTagFilters })
                }}
            />)}

        <CheckBox label="No tag" 
            checked={filter?.tagIds?.includes("null") ?? false} 
            onChange={(selected) => {
                let newTagFilters = [...(filter?.tagIds ?? [])]
                if(selected) {
                    newTagFilters.push("null")
                } else {
                    newTagFilters = newTagFilters.filter(tId => tId !== "null")
                }
                executeFilterChangeCallback(props, {... filter, tagIds: newTagFilters })
            }}
        />
    </div>
}

function executeFilterChangeCallback(props: TaskFiltersProps, newFilter: Filter) {
    if(props.onFiltersChanged) {
        props.onFiltersChanged(newFilter)
    }
}

