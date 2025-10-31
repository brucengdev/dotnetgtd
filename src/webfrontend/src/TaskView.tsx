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
        client.GetItems(filter)
            .then(items => setItems(items))
    }
    if(projects === undefined) {
        client.GetProjects()
            .then(projects => setProjects(projects))
    }
    if(tags === undefined) {
      client.GetTags()
          .then(tags => setTags(tags))
    }
    return <div data-testid="task-view" className="md:grid md:grid-cols-4">
      <TaskFilters 
        client={client} filter={filter}
        onFiltersChanged={filter => {
          setFilter(filter)
          setItems(undefined) //to reload
          props.onFilterChange?.(filter)
        }}
      />
      <div className="pt-5 md:col-span-3">
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
          : <Button text="Add" className="mb-5 block" onClick={() => setShowNewTaskForm(true)} />}
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
            setItems(undefined) //to reload items
            setProjects(undefined) //to reload projects
          }}
        />
      </div>
    </div>
}