"use client"

import agent from '@/app/lib/api/agent';
import { useCommon } from '@/context/commonContext';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ConfirmModal() {
    const { commonState: {showConfirmModal: show, postId}, showConfirmModal } = useCommon()

    const handleClose = ()=>{
        showConfirmModal(false)
    }

    const handleYes = async ()=>{
      if(postId > 0){
        const res = await agent.Posts.deletePost(postId)
        console.log(res)
        showConfirmModal(false)
      }
    }
    
    return (
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete this post</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleYes}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  export default ConfirmModal;