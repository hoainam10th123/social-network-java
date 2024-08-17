export interface IUser{
    id: number;
    name: string;
    username: string;
    lastActive: string;
    roles: IRole[];
}

export interface IRole{
    id: number;
    name: string;
}