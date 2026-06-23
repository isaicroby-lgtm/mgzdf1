"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import FeatherIcon from "feather-icons-react";
import { serverTimestamp } from "firebase/firestore";

import Editor from "ckeditor5-cb/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  fetchBlogPostByTitle,
  fetchPostComments,
  postComment,
} from "@/api/blog";
import Heading from "@/components/atoms/Heading";
import Cards from "@/components/atoms/Cards";
import Text from "@/components/atoms/Text";
import theme from "@/components/atoms/theme";

import BlogComment from "../forms/blog-comment";

const Container = styled.div`
  padding: 36px 10%;

  @media only screen and (max-width: 750px) {
    padding: 36px 4%;
  }
`;

const HeaderContainer = styled.div`
  * {
    line-height: normal !important;
  }

  padding: 22px 10%;
  width: 100% !important;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${theme["primary-color"]};
  z-index: 99;

  @media only screen and (max-width: 750px) {
    padding: 20px 4%;
  }
`;

const IndBlogPost = ({ blogName }) => {
  const [post, setPost] = useState({});
  const [openPosition, setOpenPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  const handlePostComment = async (values) => {
    setLoading(true);
    const comment = {
      ...values,
      timestamp: serverTimestamp(),
      postId: post.id,
      parentId: openPosition,
    };
    await postComment(comment);
    setLoading(false);

    alert(
      "Comentariul dvs a fost creat si urmeaza sa fie verificat de catre un admin"
    );
  };

  useEffect(() => {
    const fetchPost = async () => {
      const p = await fetchBlogPostByTitle(blogName);
      p.comments = await fetchPostComments(p.id);
      setPost(p);
    };
    fetchPost();
  }, []);

  return (
    <>
      <Cards bodypadding="0" headless>
        {post.title ? (
          <HeaderContainer>
            <div>
              <Heading as="h4" style={{ color: "white" }}>
                {post.title}
              </Heading>
              <Text
                as="p3"
                style={{ color: "white", width: "50ch", maxWidth: "100%" }}
              >
                {post.summary}
              </Text>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 6,
              }}
            >
              <Text as="p5" style={{ color: "white" }}>
                {dayjs(post.date_created.toDate())
                  .format("DD/MM/YYYY")
                  .toString()}
              </Text>
              <Text
                as="p5"
                style={{
                  color: theme["primary-color"],
                  backgroundColor: "white",
                  width: "fit-content",
                  padding: "4px 8px",
                  borderRadius: 4,
                }}
              >
                {post.category}
              </Text>
            </div>
          </HeaderContainer>
        ) : null}
        <Container>
          <CKEditor
            disabled={true}
            editor={Editor}
            data={post.content}
            onReady={() => {
              const ckeditor = document.querySelector(".ck-editor__editable");
              ckeditor.style.border = "none";

              const toolbarElement = document.querySelector(".ck-editor__top");
              toolbarElement.style.display = "none";
              toolbarElement.style.padding = 0;
            }}
          />
          <Heading as="h4" style={{ marginTop: 32 }}></Heading>
          <div
            style={{ display: "flex", flexDirection: "column", marginTop: 16 }}
          >
            {post.comments?.map((comment) => {
              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      borderBottom: "1px solid",
                      borderColor: theme["border-color-normal"],
                      paddingBottom: 8,
                      paddingTop: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "2%",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: theme["border-color-light"],
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 46,
                          height: 46,
                        }}
                      >
                        <FeatherIcon icon="user" />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Text as="p3" style={{ fontWeight: 600 }}>
                          {comment.name}{" "}
                          <span
                            style={{
                              backgroundColor: theme["primary-color"],
                              padding: "0 8px",
                              color: "white",
                              borderRadius: 2,
                              fontWeight: 400,
                              fontSize: "smaller",
                              marginLeft: 4,
                            }}
                          >
                            {" "}
                            admin doifrati.ro{" "}
                          </span>
                        </Text>
                        <Text as="p4">{comment.text}</Text>
                        <Text
                          as="p4"
                          style={{
                            color: theme["primary-color"],
                            marginTop: 8,
                            cursor: "pointer",
                          }}
                          onClick={() => setOpenPosition(comment.id)}
                        >
                          Pune o întrebare
                        </Text>
                      </div>
                    </div>
                    <Text as="p5">
                      {dayjs(comment.timestamp.toDate())
                        .format("DD/MM/YYYY")
                        .toString()}
                    </Text>
                  </div>
                  {openPosition === comment.id ? (
                    <BlogComment
                      version="edit"
                      comment={comment}
                      loading={loading}
                      handlePostComment={handlePostComment}
                    />
                  ) : null}
                  {comment.replies?.map((reply) => {
                    return (
                      <>
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            borderBottom: "1px solid",
                            borderColor: theme["border-color-normal"],
                            paddingBottom: 16,
                            paddingTop: 24,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "2%",
                              width: "100%",
                              alignItems: "center",
                              position: "relative",
                              left: 32,
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: theme["border-color-light"],
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 46,
                                height: 46,
                              }}
                            >
                              <FeatherIcon icon="user" />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Text as="p3" style={{ fontWeight: 600 }}>
                                {reply.name}{" "}
                                <span
                                  style={{
                                    backgroundColor: theme["primary-color"],
                                    padding: "0 8px",
                                    color: "white",
                                    borderRadius: 2,
                                    fontWeight: 400,
                                    fontSize: "smaller",
                                    marginLeft: 4,
                                  }}
                                >
                                  {" "}
                                  admin doifrati.ro{" "}
                                </span>
                              </Text>
                              <Text as="p4">{reply.text}</Text>
                            </div>
                          </div>
                          <Text as="p5">
                            {dayjs(reply.timestamp.toDate())
                              .format("DD/MM/YYYY")
                              .toString()}
                          </Text>
                        </div>
                      </>
                    );
                  })}
                </>
              );
            })}
            {!openPosition ? (
              <BlogComment handlePostComment={handlePostComment} />
            ) : null}
          </div>
        </Container>
      </Cards>
    </>
  );
};

export default IndBlogPost;
