import { IComment } from "@/app/lib/models/comment";
import moment from 'moment';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit'
import Form from 'react-bootstrap/Form';
import agent from "@/app/lib/api/agent";
import Button from "react-bootstrap/Button";


interface Props {
    cmt: IComment;
}

export default function Comment({ cmt }: Props) {
    const [contentComment, setContentComment] = useState(cmt.content)
    const [isEdit, setIsEdit] = useState(false)

    const updateComment = async () => {
        await agent.Comment.update(cmt.id, { content: contentComment })
        cmt.content = contentComment
        setIsEdit(false)
    }

    const renderCommentAndEdit = () => {        
        if (isEdit)
            return <div style={{marginTop: 8, marginBottom: 8}}>
                <Form.Group className="mb-3" style={{ marginRight: 4 }}>
                    <Form.Control
                        value={contentComment}
                        onChange={e => setContentComment(e.target.value)}
                        className='w-100'
                        type="text"
                        placeholder="Enter to update comment" />
                </Form.Group>

                <Button style={{margin: 6}} onClick={updateComment}  size="sm" variant="outline-success">Save</Button>
                {isEdit && <Button onClick={()=> setIsEdit(false)} size="sm" variant="outline-danger">Cancel</Button>}
            </div>

        return <div style={{
            backgroundColor: '#d7e9f5',
            borderRadius: 20,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 10,
        }}>

            <div style={{ display: 'flex' }}>
                <div style={{ color: 'blue' }}>{cmt.ownerDisplayName}</div>
                <div style={{ color: 'gray', marginLeft: 10 }}>{moment.utc(cmt.createdDate).local().fromNow()}</div>
                <div style={{ marginLeft: 8 }}><FontAwesomeIcon icon={faEdit} onClick={() => setIsEdit(true)} /></div>                
            </div>
            <div>{cmt.content}</div>
        </div>
    }

    return (
        renderCommentAndEdit()
    )
}