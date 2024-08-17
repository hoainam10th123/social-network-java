import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp'
import { useState } from 'react'
import agent from '@/app/lib/api/agent'
import { IPost } from '@/app/lib/models/post'

interface Props {
    post: IPost;
}

export default function LikePostIcon({ post }: Props) {
    const [like, setLike] = useState(post.ownerUserLikePost)

    const handleClickLike = async () => {
        const res = await agent.Posts.like(post.id)
        setLike(res.status)      
    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>            
            <FontAwesomeIcon size='2x' icon={faThumbsUp} color={like ? 'blue' : 'gray'} onClick={handleClickLike} />
            <div style={{fontSize: 20, marginLeft: 5}}>{post.totalLikes}</div>
        </div>
    )
}