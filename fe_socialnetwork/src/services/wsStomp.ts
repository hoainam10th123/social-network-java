import { Subject } from 'rxjs';

const subject = new Subject<boolean>();
export const wsStompService = {
    sendMessage: () => subject.next(true),
    getMessage: () => subject.asObservable()
};