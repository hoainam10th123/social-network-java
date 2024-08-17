"use client"

import FrientList from "@/components/FriendList";
import { useStompClient } from "@/context/StompContext";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect, useState } from "react";
import agent from "./lib/api/agent";
import { IPagination } from "./lib/models/pagination";
import { IPost } from "./lib/models/post";
import { useSession } from "next-auth/react";
import { useCommon } from "@/context/commonContext";
import { usePosts } from "@/context/baiVietContext";
import dynamic from "next/dynamic";

const ConfirmModal = dynamic(()=> import('@/modals/confirmModal'), {ssr: false})
const AddPostModal = dynamic(()=> import('@/modals/addPostModal'), {ssr: false})
const Post = dynamic(()=> import('@/components/Post'), {ssr: false})
const CustomPagination = dynamic(()=> import('@/components/CustomPagiantion'), {ssr: false})

export default function Home() {
  const { commonState: {posts}, SetPosts } = usePosts()
  const { stompState: { stompClient } } = useStompClient()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<IPagination<IPost> | null>(null);
  const { showAddPostModal } = useCommon()
  const { data } = useSession()

  //fix build error (npm run build)
  if (typeof window !== "undefined") {
    window.onbeforeunload = () => onLogout();
  }

  useEffect(() => {
    // wsStompService.getMessage().subscribe((val) => {
    // });
    if (data) {
      agent.Posts.getAll(data.user.token, currentPage, 5).then(data => {
        setPagination(data)
        SetPosts(data.data)
      })
    }

  }, [currentPage, data])

  const onLogout = () => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/user.onDisconnected"
      });
      stompClient.deactivate()
    }
  }

  return (
    <>
      <ConfirmModal />
      <AddPostModal />
      <Row style={{ marginTop: 10 }}>
        <Col md={4}>
          <ListGroup as="ul">
            <ListGroup.Item as="li" active>
              Menu
            </ListGroup.Item>
            <ListGroup.Item as="li" onClick={()=>showAddPostModal(true)}>
              Add post
            </ListGroup.Item>
            <ListGroup.Item as="li">
              Morbi leo risus
            </ListGroup.Item>
            <ListGroup.Item as="li">Porta ac consectetur ac</ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={8}>
          {
            pagination && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CustomPagination
                    currentPage={pagination.pageNumber}
                    totalCount={pagination.count}
                    pageSize={pagination.pageSize}
                    onPageChange={page => setCurrentPage(page)}
                  />
                </div>

                {posts.map((post, index) => <Post key={index} post={post} />)}

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CustomPagination
                    currentPage={pagination.pageNumber}
                    totalCount={pagination.count}
                    pageSize={pagination.pageSize}
                    onPageChange={page => setCurrentPage(page)}
                  />
                </div>
              </>
            )
          }
        </Col>
      </Row>

      <div style={{ position: 'relative' }}>
        <FrientList />
      </div>
    </>
  );
}
