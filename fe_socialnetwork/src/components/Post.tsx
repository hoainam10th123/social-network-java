import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import Form from 'react-bootstrap/Form';
import { IPost } from '@/app/lib/models/post';
import moment from 'moment';
import { useCommon } from '@/context/commonContext';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LikePostIcon from './LikePostIcon';
import { useState } from 'react';
import { useStompClient } from '@/context/StompContext';
import Comment from './Comment';


interface Props {
  post: IPost;
}

function Post({ post }: Props) {
  const [contentComment, setContentComment] = useState('')  
  const { showConfirmModal, SetPostId } = useCommon()
  const { stompState: { stompClient } } = useStompClient()
  let editorCk: ClassicEditor | null = null;

  const handleClick = () => {
    showConfirmModal(true)
    SetPostId(post.id)
  }

  const sendComment = (e:any)=>{    
    if(e.code === 'Enter' && contentComment.trim().length > 0){      
      const createComment = { content: contentComment, postId: post.id }
      
      if (stompClient) {
        stompClient.publish({
          destination: "/app/user.addComment",
          body: JSON.stringify(createComment)
        });  
        setContentComment('')      
      }
      e.preventDefault()
    }
  }

  return (
    <Card className='border-primary' style={{ marginTop: 5, marginBottom: 5 }}>
      <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: 'blue' }}>{post.user.name}</div>
          <div style={{ color: 'gray' }}>{moment.utc(post.createdDate).local().format('DD/MM/yyyy h:m:s')}</div>
        </div>
        <div>
          <FontAwesomeIcon icon={faTrashAlt} color='red' onClick={handleClick} />
        </div>
      </Card.Header>

      <Card.Body>
        <Card.Text>
          <div >
            <CKEditor
              editor={ClassicEditor}
              data={post.content}
              onReady={editor => {
                editor.enableReadOnlyMode('my-feature-id');
                editorCk = editor;
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(event) => {
                console.log(editorCk?.getData())
              }}
              onBlur={(event, editor) => {
                console.log('Blur.', editor);
              }}
              onFocus={(event, editor) => {
                console.log('Focus.', editor);
              }}
            />
          </div>
        </Card.Text>
      </Card.Body>

      <Card.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
        <LikePostIcon post={post} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 20, marginLeft: 5 }}>{3}</div>
          <FontAwesomeIcon size='2x' icon={faComment} onClick={handleClick} />
        </div>
      </Card.Footer>

      <Card.Footer>
        {
          post.comments.map((cmt, index) => <Comment key={index} cmt={cmt} />)
        }

        {/* <div style={{ color: 'blueviolet' }}>Load more</div> */}

        <Form>
          <Form.Group className="mb-3" style={{ marginRight: 4 }}>
            <Form.Control 
            value={contentComment} 
            onChange={e => setContentComment(e.target.value)} 
            className='w-100' 
            type="text" 
            placeholder="Enter to comment" onKeyDown={sendComment} />
          </Form.Group>
        </Form>

      </Card.Footer>
    </Card>
  );
}

export default Post;