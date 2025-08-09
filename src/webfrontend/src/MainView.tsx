import { useState } from "react";
import { IClient } from "./api/Client"
import { Button, ButtonMode } from "./controls/Button";
import { TaskView } from "./TaskView"
import { ProjectView } from "./ProjectView";

export interface MainViewProps {
  client: IClient
  onLogout: () => void
}

enum View {
  TASKS,
  PROJECTS
}

export function MainView({onLogout, client} : MainViewProps) {
    var [currentView, setCurrentView] = useState(View.TASKS)
    return <div data-testid="main-view">
      <Button text="Tasks" onClick={() => setCurrentView(View.TASKS)} />
      <Button text="Projects" onClick={() => setCurrentView(View.PROJECTS)} />
      {renderView(currentView, client)}
      <Button 
        className="block"
        text="Log out"
        mode={ButtonMode.DANGER}
        onClick={() => onLogout()}
        />
    </div>;
}

function renderView(view: View, client: IClient) {
  switch(view) {
    case View.PROJECTS:
      return <ProjectView />;
    case View.TASKS:
    default:
      return <TaskView client={client} />
  }
}