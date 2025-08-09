import { IClient } from "./api/Client"
import { TaskView } from "./TaskView"

export interface MainViewProps {
  client: IClient
  onLogout: () => void
}

export function MainView({onLogout, client} : MainViewProps) {
    return <TaskView client={client} onLogout={onLogout} />
}