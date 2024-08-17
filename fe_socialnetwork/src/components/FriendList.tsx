"use client"

import { IUser } from '@/app/lib/models/user';
import { useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ChatBox from './ChatBox';
import { usePresenseUsers } from '@/context/presenseUserContext';

export default function FrientList() {
    const { AddChatBox, usersState: {usersOnlineChatBox, onlineUsers} } = usePresenseUsers()

    const renderChatBox = (user: IUser, index: number)=>{
        if(usersOnlineChatBox.length % 2 !== 0){
            const right = 1;
            return <ChatBox key={index} user={user} rightPosition={right} />
        }else{
            const right = 346;
            return <ChatBox key={index} user={user} rightPosition={right} />
        }
    }

    return (
        <>
            <ListGroup style={{ position: 'fixed', left: 4, bottom: 6, maxWidth: 240, overflow: 'auto' }}>
                <ListGroup.Item active>
                    Friend list {onlineUsers.length} online
                </ListGroup.Item>

                {
                    onlineUsers.map((user, index) => (
                        <ListGroup.Item
                            key={index}
                            action
                            variant="success"
                            onClick={() => AddChatBox(user)}>{user.name}</ListGroup.Item>
                    ))
                }
            </ListGroup>

            <div style={{position: 'relative'}}>
                {
                    usersOnlineChatBox.map((cbUserOnline, index) => (
                        renderChatBox(cbUserOnline, index)
                    ))
                }
            </div>
        </>
    )
}