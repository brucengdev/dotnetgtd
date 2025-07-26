import { IClient } from "./api/Client"

interface ItemListProps {
    client?: IClient
}

export default function ItemList(_: ItemListProps) {
    return <div data-testId="item-list">
        There are no items.
    </div>
}