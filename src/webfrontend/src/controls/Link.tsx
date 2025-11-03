interface LinkProps {
    text: string
    onClick?: () => void
    className?: string
}
export function Link(props: LinkProps) {
    const { text, onClick, className } = props
    return <a href="#" className={`text-blue-800 ${className}`} onClick={_ => onClick?.()}>{text}</a>
}