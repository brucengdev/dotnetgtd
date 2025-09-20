import { Item } from "../models/Item"
import { Project } from "../models/Project"
import { Tag } from "../models/Tag"
import { Filter } from "../TaskFilters"

export interface IClient {
    Token: () => string | undefined
    IsLoggedIn: () => Promise<boolean>
    Login: (username: string, pass: string) => Promise<boolean>
    LoginByToken: (token:string) => Promise<boolean>
    Logout: () => void
    AddItem: (item: Item) => Promise<boolean>
    GetItems: (filter:Filter) => Promise<Item[]>
    DeleteItem: (id: number) => Promise<boolean>

    AddProject: (item: Project) => Promise<boolean>
    GetProjects: () => Promise<Project[]>
    DeleteProject: (id: number) => Promise<boolean>

    AddTag: (item: Tag) => Promise<boolean>
    GetTags: () => Promise<Tag[]>
    DeleteTag: (id: number) => Promise<boolean>
}

const devUrl = "https://localhost:7146"
let url = import.meta.env.VITE_API_SERVER || devUrl

//means the frontend is in same host as backend
if(url === '/') { url = '' }

export class Client implements IClient {
    private token: string = ""
    public Token() { return this.token }
    public async Login(username: string, password: string): Promise<boolean> {
        const result = await fetch(`${url}/Account/Login?${new URLSearchParams({
            username,
            password
        }).toString()}`, {
            method: "POST"
        })
        if(result.ok) {
            this.token = await result.text()
        } else {
            this.token = ""
        }
        return this.token !== ""
    }

    async IsLoggedIn() {
        return await this.IsTokenValid(this.token)
    }

    Logout() {
        this.token = ""
    }

    private async IsTokenValid(accessToken: string) {
        const result = await fetch(`${url}/Account/IsLoggedIn?${new URLSearchParams({
            accessToken
        }).toString()}`)
        return result.ok
    }

    async LoginByToken(token: string) {
        const succeeded = await this.IsTokenValid(token)
        this.token = token
        return succeeded
    }

    public async AddItem(item: Item): Promise<boolean> {
        const result = await fetch(`${url}/Items/CreateItem?${new URLSearchParams({
            accessToken: this.token
        }).toString()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        })
        return result.ok
    }

    public async GetItems(filter: Filter): Promise<Item[]> {
        const result = await fetch(`${url}/Items/GetItems?${new URLSearchParams({
            accessToken: this.token,
            complete: buildCompleteFilter(filter.completed, filter.uncompleted),
            later: buildLaterFilter(filter.active, filter.inactive),
            projectId: buildProjectIdFilter(filter)
        }).toString()}`, {
            method: "GET"
        })
        if(result.ok) {
            return await result.json()
        }
        return []
    }

    public async DeleteItem(id: number): Promise<boolean> {
        const result = await fetch(`${url}/Items/DeleteItem?${new URLSearchParams({
            accessToken: this.token,
            id: id.toString()
        }).toString()}`, {
            method: "DELETE"
        })
        return result.ok
    }

    public async AddProject(project: Project): Promise<boolean> {
        const result = await fetch(`${url}/Projects/CreateProject?${new URLSearchParams({
            accessToken: this.token
        }).toString()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
        return result.ok
    }

    public async GetProjects(): Promise<Project[]> {
        const result = await fetch(`${url}/Projects/GetProjects?${new URLSearchParams({
            accessToken: this.token,
        }).toString()}`, {
            method: "GET"
        })
        if(result.ok) {
            return await result.json()
        }
        return []
    }

    public async DeleteProject(id: number): Promise<boolean> {
        const result = await fetch(`${url}/Projects/DeleteProject?${new URLSearchParams({
            accessToken: this.token,
            id: id.toString()
        }).toString()}`, {
            method: "DELETE"
        })
        return result.ok
    }

    public async AddTag(tag: Tag): Promise<boolean> {
        const result = await fetch(`${url}/Tags/CreateTag?${new URLSearchParams({
            accessToken: this.token
        }).toString()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tag)
        })
        return result.ok
    }

    public async GetTags(): Promise<Tag[]> {
        const result = await fetch(`${url}/Tags/GetTags?${new URLSearchParams({
            accessToken: this.token,
        }).toString()}`, {
            method: "GET"
        })
        if(result.ok) {
            return await result.json()
        }
        return []
    }

    public async DeleteTag(id: number): Promise<boolean> {
        const result = await fetch(`${url}/Tags/DeleteTag?${new URLSearchParams({
            accessToken: this.token,
            id: id.toString()
        }).toString()}`, {
            method: "DELETE"
        })
        return result.ok
    }
}

function buildCompleteFilter(completed: boolean | undefined, 
    uncompleted: boolean | undefined): string {
    if(completed && uncompleted) {
        return "*"
    } 
    if(!completed && !uncompleted) {
        return ""
    } 
    if(completed) {
        return "completed"
    } 
    return "uncompleted"
}

function buildLaterFilter(active: boolean | undefined, inactive: boolean | undefined): string {
    if(active && inactive) {
        return "*"
    } 
    if(!active && !inactive) {
        return ""
    } 
    if(active) {
        return "now"
    } 
    return "later"
}

function buildProjectIdFilter(filter: Filter): string {
    const { projectIds, tasksInNoProject } = filter
    if(projectIds === undefined) { return "*" }
    return projectIds.join(",") + (tasksInNoProject ? ",null" : "")
}

