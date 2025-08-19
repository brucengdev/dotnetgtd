interface ProjectListItemProps {
    name: string
}
export function ProjectListItem({name}: ProjectListItemProps) {
    return <div data-testid="project">
        <div data-testid="description">{name}</div>
    </div>
}