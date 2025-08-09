import { IClient } from "./api/Client"
import { Button, ButtonMode } from "./controls/Button";
import { TaskView } from "./TaskView"

export interface MainViewProps {
  client: IClient
  onLogout: () => void
}

export function MainView({onLogout, client} : MainViewProps) {
    return <>
      <TaskView client={client} onLogout={onLogout} />
      <Button 
        className="block"
        text="Log out"
        mode={ButtonMode.DANGER}
        onClick={() => onLogout()}
        />
    </>;
}