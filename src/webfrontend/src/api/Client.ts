import { Item } from "../models/Item"

export interface IClient {
    Token: () => string | undefined
    IsLoggedIn: () => Promise<boolean>
    Login: (username: string, pass: string) => Promise<boolean>
    LoginByToken: (token:string) => Promise<boolean>
    Logout: () => void
    AddItem: (item: Item) => Promise<boolean>
    GetItems: () => Promise<Item[]>
    DeleteItem: (id: number) => Promise<boolean>
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

    public async GetItems(): Promise<Item[]> {
         const result = await fetch(`${url}/Items/GetItems?${new URLSearchParams({
            accessToken: this.token,
        }).toString()}`, {
            method: "GET"
        })
        if(result.ok) {
            return await result.json()
        }
        return []
    }

    public async DeleteItem(_: number): Promise<boolean> {
        //TODO: implement delete item
        return false;
    }
}