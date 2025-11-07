import { useState } from "react"
import { IClient } from "./api/Client"
import { Button } from "./controls/Button"
import { AddItemForm } from "./AddItemForm"
import ItemList from "./ItemList"
import { Item } from "./models/Item"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"
import { TaskFilter, TaskFilters } from "./TaskFilters"

export interface TaskViewProps {
  client: IClient,
  filter?: TaskFilter,
  onFilterChange?: (filter: TaskFilter) => void
}

export const defaultTasksFilter: TaskFilter = {
  active: true,
  uncompleted: true,
  projectIds: ["nonnull", "null"],
  tagIds: ["nonnull", "null"]
}

export function TaskView(props: TaskViewProps) {
    const { client } = props
    const [showNewTaskForm, setShowNewTaskForm] = useState(false)
    const [items, setItems] = useState(undefined as (Item[]|undefined))
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    const [tags, setTags] = useState<Tag[] | undefined>(undefined)
    const [filter, setFilter] = useState<TaskFilter>(props.filter ?? defaultTasksFilter)
    if(items === undefined) {
      (async () => {
        const items = await client.GetItems(filter)
        setItems(items)
      })()
    }
    if(projects === undefined) {
      (async () => {
        const projects = await client.GetProjects(filter)
        projects.sort((a, b) => a.name.localeCompare(b.name))
        setProjects(projects)
      })()
    }
    if(tags === undefined) {
      (async () => {
        const tags = await client.GetTags()
        setTags(tags)
      })()
    }
    return <div data-testid="task-view" 
      className="sm:grid sm:grid-cols-3 lg:grid-cols-5">
      <TaskFilters 
        client={client} filter={filter}
        onFiltersChanged={filter => {
          setFilter(filter)
          setItems(undefined) //to reload
          setProjects(undefined) //to reload
          props.onFilterChange?.(filter)
        }}
      />
      <div className="sm:col-span-2 lg:col-span-4">
        {showNewTaskForm
          ? <AddItemForm client={client} 
              projectFilter={filter}
              onCancel={() => setShowNewTaskForm(false)} 
              onCompleted={() => {
                  setShowNewTaskForm(false)
                  setItems(undefined) //to reload
                }
              }
              />
          : <Button text="Add" className="mb-2 block" onClick={() => setShowNewTaskForm(true)} />}
        <ItemList items={items} projects={projects} tags={tags}
          onDelete={(item: Item) => {
              client.DeleteItem(item.id)
                  .then(() => {
                      setItems(undefined) //to reload
                  })
          }}
          onUpdate={async (item: Item) => {
            const existingItem = items?.find(i => i.id === item.id)
            if(existingItem && item.projectId !== undefined) {
              const project = projects?.find(p => p.id === item.projectId)
              //an item in a project has later status same as project's
              //changing item's later status should update project later status
              if(project && project.later !== item.later) {
                await client.UpdateProject({
                  ...project,
                  later: item.later
                })
              }
            }
            await client.UpdateItem(item);
            const [updatedItems, updatedProjects] = await Promise.all([
              client.GetItems(filter),
              client.GetProjects(filter)
            ])
            setItems(updatedItems)
            setProjects(updatedProjects)
          }}
        />
      </div>
    </div>
}