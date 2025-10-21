import { useState } from "react";
import { IClient } from "./api/Client"
import { Button, ButtonMode } from "./controls/Button";
import { TaskView } from "./TaskView"
import { ProjectView } from "./ProjectView";
import { TagView } from "./TagView";

export interface MainViewProps {
  client: IClient
  onLogout: () => void
}

enum View {
  TASKS,
  PROJECTS,
  TAGS
}

export function MainView({onLogout, client} : MainViewProps) {
    var [currentView, setCurrentView] = useState(View.TASKS)
    return <div data-testid="main-view">
      <Button 
        className="block mb-4"
        text="Log out"
        mode={ButtonMode.DANGER}
        onClick={() => onLogout()}
        />
      <Button text="Tasks" mode={buttonMode(View.TASKS, currentView)}
        className="mr-1" onClick={() => setCurrentView(View.TASKS)} />
      <Button text="Projects" mode={buttonMode(View.PROJECTS, currentView)}
        className="mr-1" onClick={() => setCurrentView(View.PROJECTS)} />
      <Button text="Tags" mode={buttonMode(View.TAGS, currentView)}
        onClick={() => setCurrentView(View.TAGS)} />
      {renderView(currentView, client)}
    </div>;
}

function buttonMode(view: View, currentView: View) {
  return view === currentView ? ButtonMode.PRIMARY: ButtonMode.SECONDARY;
}

function renderView(view: View, client: IClient) {
  switch(view) {
    case View.PROJECTS:
      return <ProjectView client={client} />
    case View.TAGS:
      return <TagView client={client} />;
    case View.TASKS:
    default:
      return <TaskView client={client} />
  }
}