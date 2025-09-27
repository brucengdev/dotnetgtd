import { IClient } from "../api/Client";
import { Item } from "../models/Item";
import { Project } from "../models/Project";
import { Tag } from "../models/Tag";
import { Filter } from "../TaskFilters";
import { isAnIntId } from "../utils";

export const TEST_USER_NAME = "valid_user"
export const TEST_PASSWORD = "correct_pass"
export const TEST_TOKEN = "correcttoken"

export class TestClient implements IClient {
    private _token: string | undefined = undefined
    public Items: Item[] = []
    public Projects: Project[] = []
    public Tags: Tag[] = []
    public Token() { return this._token }
    async IsLoggedIn() {
        return this._token === TEST_TOKEN
    }
    async Login(username: string, pass: string) {
        const loggedIn = username === TEST_USER_NAME && pass === TEST_PASSWORD;
        if(loggedIn) {
            this._token = TEST_TOKEN
        }
        return this.IsLoggedIn();
    }

    Logout() {
        this._token = ""
    }

    async LoginByToken(token: string) {
        const loggedIn = token === TEST_TOKEN
        if(loggedIn) {
            this._token = token
        }
        return loggedIn
    }

    async AddItem(item: Item): Promise<boolean> {
        this.Items.push(item)
        return true
    }

    async GetItems(filter:Filter): Promise<Item[]> {
        let filteredItems = this.Items
            .filter(i => {
                return this.completionFilter(filter, i) 
                    && this.activeFilter(filter, i)
                    && this.projectFilter(filter, i)
                    && this.tagFilter(filter, i)
            })

            filteredItems = filteredItems.map(i =>{
            return {...i}
        })
        return [...filteredItems]
    }
    projectFilter(filter: Filter, i: Item): unknown {
        if(filter.projectIds === undefined) {
            return true
        }
        if(filter.projectIds.length === 0 && i.projectId === undefined) {
            return true
        }
        if(i.projectId !== undefined && filter.projectIds.includes(i.projectId.toString())) {
            return true
        }
        if(i.projectId === undefined && filter.projectIds.includes("null")) {
            return true
        }
        if(i.projectId !== undefined && filter.projectIds.includes("nonnull")) {
            return true
        }
        return false
    }

    tagFilter(filter: Filter, i: Item): boolean {
        if(filter.tagIds === undefined) {
            return true
        }
        if(filter.tagIds.includes("nonnull") && (i.tagIds?.length?? 0) > 0) {
            return true
        }
        if(filter.tagIds.includes("null") && (i.tagIds?.length?? 0) === 0) {
            return true
        }
        if(filter.tagIds.some(tId => isAnIntId(tId) && i.tagIds?.includes(parseInt(tId)))) {
            return true
        }
        return false
    }

    private completionFilter(filter: Filter, i: Item): boolean {
        if(filter.uncompleted && !i.done) {
            return true
        }
        if(filter.completed && i.done) {
            return true
        }
        return false
    }

    private activeFilter(filter: Filter, i: Item): boolean {
        if(filter.active && !i.later) {
            return true
        }
        if(filter.inactive && i.later) {
            return true
        }
        return false
    }

    async DeleteItem(id: number) {
        const itemIndex = this.Items.findIndex(i => i.id === id)
        this.Items.splice(itemIndex, 1)
        return itemIndex >= 0
    }

    async AddProject(project: Project): Promise<boolean> {
        this.Projects.push(project)
        return true
    }

    async GetProjects(): Promise<Project[]> {
        return [...this.Projects.map(p => {
            return {...p}
        })]
    }
    
    async DeleteProject(id: number) {
        const projects = this.Projects.findIndex(i => i.id === id)
        this.Projects.splice(projects, 1)
        return projects >= 0
    }

    async AddTag(tag: Tag): Promise<boolean> {
        this.Tags.push(tag)
        return true
    }

    async GetTags(): Promise<Tag[]> {
        return [...this.Tags.map(p => {
            return {...p}
        })]
    }

    async DeleteTag(id: number) {
        const tagIndex = this.Tags.findIndex(i => i.id === id)
        this.Tags.splice(tagIndex, 1)
        return tagIndex >= 0
    }
}