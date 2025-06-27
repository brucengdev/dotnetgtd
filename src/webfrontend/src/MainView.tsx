import { IClient } from "./api/Client"
import { Button } from "./controls/Button"

export interface MainViewProps {
  client: IClient
  onLogout: () => void
}

export function MainView({onLogout} : MainViewProps) {
    return <div data-testid="main-view" className="row-auto">
      <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-gray-900">GTD</h2>
      </div>
      <Button 
        text="Log out"
        onClick={() => onLogout()}
      />
    </div>
}