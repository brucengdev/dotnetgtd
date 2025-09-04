export interface Item {
    id: number
    description: string
    projectId?: number
    tagIds?: number[]
    done: boolean
    later: boolean
}