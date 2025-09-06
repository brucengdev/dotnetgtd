interface LinkProps {
    text: string
}
export function Link(props: LinkProps) {
    const { text } = props
    return <a href="#">{text}</a>
}