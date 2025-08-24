import { IClient } from "../api/Client";
import { Item } from "../models/Item";
import { Project } from "../models/Project";

export const TEST_USER_NAME = "valid_user"
export const TEST_PASSWORD = "correct_pass"
export const TEST_TOKEN = "correcttoken"

export class TestClient implements IClient {
    private _token: string | undefined = undefined
    public Items: Item[] = []
    public Projects: Project[] = []
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

    async GetItems() {
        return [...this.Items.map(i =>{
            return {...i}
        })]
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
}