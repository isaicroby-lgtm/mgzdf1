"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import FeatherIcon from "feather-icons-react";
import { getDownloadURL, ref } from "firebase/storage";
import { useRouter } from "next/navigation";

import { storage } from "@/public/firebase";
import { deleteBlogPost, fetchAllBlogPosts } from "@/api/blog";
import theme from "@/components/atoms/theme";
import Modal from "@/components/atoms/Modal";
import PageHeader from "@/components/atoms/PageHeader";
import Button from "@/components/atoms/Button";
import { Main } from "@/components/style";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

const Container = styled.div`
  max-width: 2000px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 3%;
  row-gap: 48px;

  @media only screen and (min-width: 1600px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media only screen and (max-width: 1250px) {
    grid-template-columns: 1fr 1fr;
  }

  @media only screen and (max-width: 750px) {
    grid-template-columns: 1fr;
    padding: 8px 4%;
  }

  .col {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    box-shadow: 0 0 4px ${theme["primary-color"]}40;
    min-height: 300px;
    padding: 20px;

    text-align: center;
    cursor: pointer;

    transition: all 300ms ease-in-out;

    img {
      transition: all 300ms ease-in-out;
    }
  }

  .col:hover {
    box-shadow: 0 0 8px ${theme["primary-color"]}50;

    img {
      filter: brightness(70%);
    }
  }
`;

const BlogAdmin = () => {
  const router = useRouter();

  const [deleteModal, setDeleteModal] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await fetchAllBlogPosts(true);
      for (let i = 0; i < allPosts.length; ++i) {
        allPosts[i].date_created = allPosts[i].date_created.toDate();
        const cover_url = await getDownloadURL(
          ref(storage, allPosts[i].cover_reference)
        );
        allPosts[i].coverPicture = cover_url;
      }
      setPosts(allPosts);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <Modal
        title="Esti sigur ca vrei sa dai delete la aceasta postare de blog?"
        visible={deleteModal}
        onCancel={() => setDeleteModal()}
        onOk={async () => {
          await deleteBlogPost(deleteModal);
          setDeleteModal();
          setPosts((prev) => prev.filter((p) => p.id !== deleteModal));
        }}
      />
      <PageHeader
        title="Blog"
        buttons={[
          <Button
            key={2}
            type="primary"
            outlined
            onClick={() => router.push("/admin/blog/nou/")}
          >
            Creeaza o postare!
          </Button>,
        ]}
      />
      <Main theme={theme}>
        <Container gutter={30}>
          {posts.map((blogPost) => {
            return (
              <div
                className="col"
                key={blogPost.id}
                onClick={() => router.push("/admin/blog/nou/" + blogPost.id)}
              >
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteModal(blogPost.id);
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "white",
                    padding: 8,
                    borderRadius: "0 0 0 6px",
                    zIndex: 50,
                  }}
                >
                  <FeatherIcon
                    icon="trash"
                    style={{ color: theme["secondary-color"] }}
                    size={22}
                  />
                </div>
                <img
                  src={blogPost.coverPicture}
                  style={{ width: "100%", objectFit: "cover", minHeight: 200 }}
                  alt=""
                />
                <Text
                  as="p5"
                  style={{
                    backgroundColor: theme["primary-color"],
                    color: "white",
                    padding: "4px 12px",
                    position: "relative",
                    bottom: 12,
                  }}
                >
                  {blogPost.category}
                </Text>
                <Heading as="h5" style={{ marginBottom: 8 }}>
                  {blogPost.title}
                </Heading>
                <Text as="p5" style={{ marginBottom: 24 }}>
                  {blogPost.summary}
                </Text>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    background: "white",
                    padding: 12,
                  }}
                >
                  <Heading as="h5">
                    {dayjs(blogPost.date_created)
                      .format("DD/MM/YYYY")
                      .toString()}
                  </Heading>
                </div>
                <Button type="primary" outlined>
                  Editează postare
                </Button>
              </div>
            );
          })}
        </Container>
      </Main>
    </>
  );
};

export default BlogAdmin;
