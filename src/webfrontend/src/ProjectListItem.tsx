interface ProjectListItemProps {
    name: string
}
export function ProjectListItem({name}: ProjectListItemProps) {
    return <div data-testid="project"  className="grid grid-cols-2 mb-1">
        <div data-testid="name">{name}</div>
    </div>
}