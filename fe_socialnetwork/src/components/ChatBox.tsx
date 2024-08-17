"use client"

import { IUser } from '@/app/lib/models/user';
import { useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons/faCircleXmark'
import { usePresenseUsers } from '@/context/presenseUserContext';
import { useMessages } from '@/context/messageStompContext';
import { useSession } from 'next-auth/react';
import { useStompClient } from '@/context/StompContext';
import moment from 'moment';


interface Props {
    user: IUser;
    rightPosition: number;
}

export default function ChatBox({ user, rightPosition }: Props) {
    const [content, setContent] = useState('')
    const { RemoveChatBox } = usePresenseUsers()
    const { stompState: { stompClient } } = useStompClient()
    const { messageState: { recievedMessages } } = useMessages()        
    const { data } = useSession()
    const endRef = useRef<any>()

    const getGroupName = () => {
        const groups = Array.from(recievedMessages.keys())
        let returnGroup: string = ""
        for(let i = 0; i < groups.length; i++){
            const splitUsername = groups[i].split('-')
            const tontai = splitUsername[0] === user.username || splitUsername[1] === user.username
            if(tontai) {
                returnGroup = groups[i];
                break;
            }
        }
        return returnGroup;
    }

    useEffect(() => {
        const chatBox = document.getElementById(user.username)
        if (chatBox) {
            chatBox.style.right = `${rightPosition}px`
        }
    }, [])

    useEffect(() => {
        if(stompClient && stompClient.connected){
            const userNhan = user.username
            stompClient.publish({destination: '/app/user.loadMessages', body: JSON.stringify(userNhan)})
        }
    }, [])

    useEffect(() => {
        scrollToBottom() 
    }, [recievedMessages.get(getGroupName())?.length])

    const scrollToBottom = () => {
        endRef.current.scrollIntoView({ behavior: "smooth" })        
    }    

    const renderMessages = ()=>{    
        const messages = recievedMessages.get(getGroupName())
        if(messages){
            return messages.map((msg, index) => {
                if(data?.user.user.username === msg.senderUsername)
                    return <MessageRight
                    key={index}
                    content={msg.content}
                    name={msg.senderUsername}  />
                    
                return <MessageLeft
                    key={index}
                    content={msg.content}
                    name={msg.senderUsername}  /> 
            })
        }
        return []
    }

    const sendMessage = (e: any) => {
        if(e.key === 'Enter' && stompClient && stompClient.connected && content.trim() !== ''){
            const msg = { content, recipientUsername: user.username}
            stompClient.publish({destination: '/app/user.sendMessage', body: JSON.stringify(msg)})
            setContent('')
            e.preventDefault();
        }
    }

    return (
        <Card id={user.username} style={{ width: '340px', position: 'fixed', bottom: 2, zIndex: 9999 }} >
            <Card.Header style={{
                backgroundColor: 'burlywood',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{ fontWeight: 'bold' }}>
                        {user.name}
                    </div>
                    <div style={{ color: 'gray', fontSize: 14 }}>{moment.utc(user.lastActive).local().fromNow()}</div>
                </div>

                <FontAwesomeIcon size='2x' icon={faCircleXmark} onClick={() => RemoveChatBox(user.username)} />
            </Card.Header>

            <Card.Body style={{ height: 420, overflowY: 'auto' }}>                
                {renderMessages()}
                <div ref={endRef}></div>
            </Card.Body>
            <Card.Footer>
                <Form>
                    <Form.Group className="mb-3" style={{ marginRight: 4 }}>
                        <Form.Control className='w-100' onKeyDown={sendMessage} value={content} onChange={(e)=> setContent(e.target.value)} type="text" placeholder="Enter to send message" />
                    </Form.Group>
                </Form>
            </Card.Footer>
        </Card>
    )
}

interface PropsMessage {
    content: string;
    name: string;
}

function MessageLeft({ name, content }: PropsMessage) {

    return (
        <div style={{ marginTop: 8, display: 'flex' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{ fontWeight: 'bold' }}>{name}</div>
                <div style={{
                    color: 'white',
                    backgroundColor: '#1976d2',
                    padding: 5,
                    borderRadius: 10
                }}>{content}</div>
            </div>
        </div>
    )
}

function MessageRight({ name, content }: PropsMessage) {

    return (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{ fontWeight: 'bold' }}>{name}</div>
                <div style={{
                    color: 'white',
                    backgroundColor: '#1976d2',
                    padding: 5,
                    borderRadius: 10
                }}>{content}</div>
            </div>
        </div>
    )
}