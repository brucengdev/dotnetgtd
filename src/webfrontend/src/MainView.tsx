import { useState } from "react";
import { IClient } from "./api/Client"
import { Button, ButtonMode } from "./controls/Button";
import { defaultTasksFilter, TaskView } from "./TaskView"
import { defaultProjectsFilter, ProjectView } from "./ProjectView";
import { TagView } from "./TagView";
import { TaskFilter } from "./TaskFilters";
import { ProjectFilter } from "./ProjectFilters";

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
    const [tasksFilter, setTasksFilter] = useState(defaultTasksFilter)
    const [projectsFilter, setProjectsFilter] = useState(defaultProjectsFilter)
    return <div data-testid="main-view">
      <div className="flex">
        <Button text="Tasks" mode={buttonMode(View.TASKS, currentView)}
          className="mr-1" onClick={() => setCurrentView(View.TASKS)} />
        <Button text="Projects" mode={buttonMode(View.PROJECTS, currentView)}
          className="mr-1" onClick={() => setCurrentView(View.PROJECTS)} />
        <Button text="Tags" mode={buttonMode(View.TAGS, currentView)}
          onClick={() => setCurrentView(View.TAGS)} />
        <Button 
            className="ml-auto mb-2"
            text="Log out"
            mode={ButtonMode.DANGER}
            onClick={() => onLogout()}
            />
      </div>
      {renderView(currentView, client, 
        tasksFilter, setTasksFilter, 
        projectsFilter, setProjectsFilter)}
    </div>;
}

function buttonMode(view: View, currentView: View) {
  return view === currentView ? ButtonMode.PRIMARY: ButtonMode.SECONDARY;
}

function renderView(view: View, 
  client: IClient, 
  tasksFilter: TaskFilter,
  setTasksFilter: (filter: TaskFilter) => void,
  projectsFilter: ProjectFilter,
  setProjectsFilter: (filter: ProjectFilter) => void
) {
  switch(view) {
    case View.PROJECTS:
      return <ProjectView client={client} 
            filter={projectsFilter} onFilterChange={setProjectsFilter} />
    case View.TAGS:
      return <TagView client={client} />;
    case View.TASKS:
    default:
      return <TaskView client={client} 
            filter={tasksFilter} onFilterChange={setTasksFilter} />
  }
}