import { Button, ButtonMode } from "./controls/Button"

interface ConfirmDeleteViewProps {
    onYes?: () => void
    onNo?: () => void
}

export function ConfirmDeleteView({onYes, onNo}: ConfirmDeleteViewProps) {
    return <div data-testid="confirmDeleteView" className="grid-cols-3">
        <h2 className="font-semibold text-red-600 text-2xl mb-2">
            Confirm to delete?
        </h2>
        <Button text="Yes" className="mr-2" mode={ButtonMode.DANGER} onClick={() => {if(onYes) {onYes()}}}  />
        <Button text="No" mode={ButtonMode.PRIMARY} onClick={() => {if(onNo) {onNo()}}}  />
    </div>
}