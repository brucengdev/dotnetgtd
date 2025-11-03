interface LinkProps {
    text: string
    onClick?: () => void
}
export function Link(props: LinkProps) {
    const { text, onClick } = props
    return <a href="#" className="text-blue-800" onClick={_ => onClick?.()}>{text}</a>
}