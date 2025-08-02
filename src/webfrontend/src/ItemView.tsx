import { ConfirmDeleteView } from "./ConfirmDeleteView"

interface ItemViewProps {
    description: string
}
export default function ItemView(props: ItemViewProps) {
    const { description } = props
    return <div data-testId="item">
                <div data-testId="description">{description}</div>
                <button>Delete</button>
                <ConfirmDeleteView />
        </div>
}