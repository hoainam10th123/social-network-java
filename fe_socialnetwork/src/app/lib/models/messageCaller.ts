import { IMessage } from "./message";

export interface MessageCaller{
    group: string;
    messages: IMessage[];
}