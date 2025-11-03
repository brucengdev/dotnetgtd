interface LinkProps {
    text: string
}
export function Link(props: LinkProps) {
    const { text } = props
    return <a href="#" className="text-blue-800">{text}</a>
}