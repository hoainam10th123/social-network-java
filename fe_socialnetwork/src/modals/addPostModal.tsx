"use client"

import agent from '@/app/lib/api/agent';
import { useCommon } from '@/context/commonContext';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { usePosts } from '@/context/baiVietContext';
import { toast } from 'react-toastify';


function AddPostModal() {
    const { AddPost } = usePosts()
    const { commonState: { showAddPostModal: show }, showAddPostModal } = useCommon()
    let editorCk: ClassicEditor | null = null;

    const handleClose = () => {
        showAddPostModal(false)
    }


    const save = async () => {
        //console.log(editorCk?.getData())
        const res = await agent.Posts.addPost(editorCk?.getData())
        AddPost(res)
        showAddPostModal(false)
        toast.success("add post success")
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add new post?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{}}>
                    <CKEditor
                        editor={ClassicEditor}
                        data={"<p>Hãy soạn thảo nội dung vào đây</p>"}
                        onReady={editor => {
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={save}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddPostModal;