import { useState } from "react"
import { IClient } from "./api/Client"
import { Button } from "./controls/Button"
import { AddItemForm, TaskInitialValues } from "./AddItemForm"
import ItemList from "./ItemList"
import { Item } from "./models/Item"
import { Tag } from "./models/Tag"
import { ProjectAndNoNextActions, TaskFilter, TaskFilters } from "./TaskFilters"
import { ProjectFilter } from "./ProjectFilters"

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
    const [projects, setProjects] = useState<ProjectAndNoNextActions[] | undefined>(undefined)
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
        setProjects(await loadProjectWithNoNextActions(client, filter))
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
        projects={projects}
        client={client} filter={filter}
        onFiltersChanged={filter => {
          setFilter(filter)
          Promise.all([
            client.GetItems(filter),
            loadProjectWithNoNextActions(client, filter)
          ]).then(([filteredTasks, filteredProjects]) => {
            setItems(filteredTasks)
            setProjects(filteredProjects)
            props.onFilterChange?.(filter)
          })
        }}
      />
      <div className="sm:col-span-2 lg:col-span-4">
        {showNewTaskForm
          ? <AddItemForm client={client} 
              initialValues={buildInitialValues(filter)}
              projectFilter={filter}
              onCancel={() => setShowNewTaskForm(false)} 
              onCompleted={async () => {
                  setShowNewTaskForm(false)
                  const items = await client.GetItems(filter)
                  setItems(items)
                  setProjects(await loadProjectWithNoNextActions(client, filter))
                }
              }
              />
          : <Button text="Add" className="mb-2 block" onClick={() => setShowNewTaskForm(true)} />}
        <ItemList items={items} projects={projects} tags={tags}
          onDelete={async (item: Item) => {
              await client.DeleteItem(item.id)
              setItems(await client.GetItems(filter))
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
              loadProjectWithNoNextActions(client, filter)
            ])
            setItems(updatedItems)
            setProjects(updatedProjects)
          }}
        />
      </div>
    </div>
}


function buildInitialValues(filter: TaskFilter): TaskInitialValues {
  const initialValues:TaskInitialValues = {};
  (filter.projectIds || []).find((pId: string) => {
    if(Number.isInteger(parseInt(pId))) {
      initialValues.projectId = parseInt(pId)
      return true;
    }
    return false;
  })

  var tagIds: number[] = (filter.tagIds?? [])
    .map(tagFilter => parseInt(tagFilter))
    .filter(tagId => Number.isInteger(tagId))

  initialValues.tagIds = tagIds

  initialValues.done = filter.completed ?? false
  initialValues.later = filter.inactive ?? false

  return initialValues
}

async function loadProjectWithNoNextActions(client: IClient, filter: ProjectFilter): Promise<ProjectAndNoNextActions[]> {
  const projects = await client.GetProjects(filter)
  projects.sort((a, b) => a.name.localeCompare(b.name))
  const tasks = await client.GetItems({ 
    projectIds: projects.map(p => p.id.toString()), 
    active: true,
    uncompleted: true,
    tagIds: ["nonnull"]
  })
  projects.forEach(project => {
    const numberOfNextActions = tasks.filter(t => t.projectId === project.id).length;
    (project as ProjectAndNoNextActions).numberOfNextActions = numberOfNextActions
  })
  return projects
}