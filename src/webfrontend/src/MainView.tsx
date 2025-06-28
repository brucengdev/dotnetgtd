import { useState } from "react"
import { IClient } from "./api/Client"
import { Button } from "./controls/Button"
import { AddItemForm } from "./AddItemForm"

export interface MainViewProps {
  client: IClient
  onLogout: () => void
}

export function MainView({onLogout} : MainViewProps) {
    const [showNewTaskForm, setShowNewTaskForm] = useState(false)
    return <div data-testid="main-view" className="row-auto">
      <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-gray-900">GTD</h2>
      </div>
      {showNewTaskForm
        ? <AddItemForm onCancel={() => setShowNewTaskForm(false)} />
        : <Button text="Add" onClick={() => setShowNewTaskForm(true)} />}
      <Button 
        text="Log out"
        onClick={() => onLogout()}
      />
    </div>
}