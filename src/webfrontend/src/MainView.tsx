import { useState } from "react"
import { IClient } from "./api/Client"
import { Button } from "./controls/Button"
import { AddItemForm } from "./AddItemForm"
import ItemList from "./ItemList"

export interface MainViewProps {
  client: IClient
  onLogout: () => void
}

export function MainView({onLogout, client} : MainViewProps) {
    const [showNewTaskForm, setShowNewTaskForm] = useState(false)
    return <div data-testid="main-view" className="row-auto">
      <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-gray-900">GTD</h2>
      </div>
      <ItemList />
      {showNewTaskForm
        ? <AddItemForm client={client} 
            onCancel={() => setShowNewTaskForm(false)} 
            onCompleted={() => setShowNewTaskForm(false)}
            />
        : <Button text="Add" onClick={() => setShowNewTaskForm(true)} />}
      <Button 
        text="Log out"
        onClick={() => onLogout()}
      />
    </div>
}