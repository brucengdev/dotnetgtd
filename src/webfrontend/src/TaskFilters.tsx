import { useState } from "react"
import { IClient } from "./api/Client"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"
import { CheckBox } from "./controls/CheckBox"
import { isAnIntId } from "./utils"
import { Button, ButtonMode } from "./controls/Button"

export interface TaskFilter {
    completed?: boolean
    uncompleted?: boolean
    active?: boolean
    inactive?: boolean
    projectIds?: string[]
    tagIds?: string[]
}

interface TaskFiltersProps {
    client: IClient
    filter?: TaskFilter
    projects?: ProjectAndNoNextActions[]
    onFiltersChanged?: (filter: TaskFilter) => void
}

export interface ProjectAndNoNextActions extends Project {
    numberOfNextActions?: number
}

export function TaskFilters(props: TaskFiltersProps) {
    const { client, filter, projects } = props
    const [tags, setTags] = useState<Tag[] | undefined>(undefined)
    const [collapsed, setCollapsed] = useState<boolean>(window.innerWidth <= 640)
    if(tags === undefined) {
        (async () => {
            const retrievedTags = await client.GetTags()
            setTags(retrievedTags)
        })()
    }

    const projectFilters = (projects || [])
        .filter(p => {
            const completionFilter = !filter?.completed && !filter?.uncompleted
                || filter?.uncompleted === true && !p.done
                || filter?.completed === true && p.done

            const activeFilter = !filter?.inactive && !filter?.active
                || filter?.active === true && !p.later
                || filter?.inactive === true && p.later
            return completionFilter && activeFilter
        })
        .sort((a,b) => a.name.localeCompare(b.name))

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

    return <div data-testId="task-filters" className="pt-5">
        <Button 
            text={collapsed? "Filters ▲":"Filters ▼"} 
            mode={ButtonMode.SECONDARY} 
            onClick={() => {
                setCollapsed(!collapsed)
            } 
        }/>
        {!collapsed && <>
            <CheckBox label="Active tasks"
                className="block" 
                checked={filter?.active ?? false}
                onChange={(selected) => {
                    executeFilterChangeCallback(props, { ...filter, active: selected })
                }}
            />
            <CheckBox label="Inactive tasks" checked={filter?.inactive ?? false} 
                onChange={(selected) => {
                    executeFilterChangeCallback(props, { ...filter, inactive: selected })
                }} 
            />

            <hr />

            <CheckBox label="Completed tasks" 
                className="block"
                checked={filter?.completed?? false}
                onChange={(selected) => {
                    executeFilterChangeCallback(props, { ...filter, completed: selected })
                }}
            />
            <CheckBox label="Uncompleted tasks" checked={filter?.uncompleted ?? false} 
                onChange={(selected) => {
                    executeFilterChangeCallback(props, { ...filter, uncompleted: selected })
                }}
            />

            <hr/>
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
            <hr/>
            {(tags || []).map(t => 
                <CheckBox key={t.id} label={t.name} 
                    className="block"
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

            <hr />

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
            <hr/>
            {projectFilters.map(p => 
                <CheckBox key={p.id} label={p.name} 
                    className={"block " + ((p.numberOfNextActions ?? 0) == 0 ? "text-red-500": "")}
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
        </>}
    </div>
}

function executeFilterChangeCallback(props: TaskFiltersProps, newFilter: TaskFilter) {
    if(props.onFiltersChanged) {
        props.onFiltersChanged(newFilter)
    }
}

