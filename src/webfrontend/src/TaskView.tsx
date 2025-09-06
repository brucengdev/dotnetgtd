import { useState } from "react"
import { IClient } from "./api/Client"
import { Button } from "./controls/Button"
import { AddItemForm } from "./AddItemForm"
import ItemList from "./ItemList"
import { Item } from "./models/Item"
import { Project } from "./models/Project"
import { Tag } from "./models/Tag"
import { TaskFilters } from "./TaskFilters"

export interface TaskViewProps {
  client: IClient
}

export function TaskView({ client} : TaskViewProps) {
    const [showNewTaskForm, setShowNewTaskForm] = useState(false)
    const [items, setItems] = useState(undefined as (Item[]|undefined))
    const [projects, setProjects] = useState<Project[] | undefined>(undefined)
    const [tags, setTags] = useState<Tag[] | undefined>(undefined)
    if(items === undefined) {
        client.GetItems()
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
    return <div data-testid="task-view" className="row-auto">
      <TaskFilters />
      <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-gray-900">GTD</h2>
      </div>
      <ItemList items={items} projects={projects} tags={tags}
        onDelete={(item: Item) => {
            client.DeleteItem(item.id)
                .then(() => {
                    setItems(undefined) //to reload
                })
        }}
      />
      {showNewTaskForm
        ? <AddItemForm client={client} 
            onCancel={() => setShowNewTaskForm(false)} 
            onCompleted={() => {
                setShowNewTaskForm(false)
                setItems(undefined) //to reload
              }
            }
            />
        : <Button text="Add" className="mb-5 block" onClick={() => setShowNewTaskForm(true)} />}
    </div>
}