"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";
import { getDownloadURL, ref } from "firebase/storage";

import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import theme from "@/components/atoms/theme";
import { encodeURL } from "@/utility/urlFormatting";

import { storage } from "@/public/firebase";
import { fetchAllBlogPosts } from "@/api/blog";

const ContainerFake = styled.div`
  max-width: 2000px;
  min-height: 40vh;
  padding: 8px 10%;

  @media only screen and (max-width: 750px) {
    padding: 8px 4%;
  }
`;

const HeaderContainer = styled.div`
  padding: 18px 36px 18px 10%;
  width: fit-content;
  border-radius: 0 0 10px 0;

  margin-bottom: 48px;

  background-color: ${theme["primary-color"]};
  z-index: 99;

  @media only screen and (max-width: 750px) {
    padding: 16px 4%;
  }
`;

const Container = styled.div`
  max-width: 2000px;
  min-height: 40vh;
  padding: 8px 10%;

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
      filter: brightness(80%);
    }
  }
`;

const BlogPosts = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [posts, setPosts] = useState([]);

  const handleNavigateToPage = (id, title) => {
    if (pathname?.includes("admin")) router.push("/admin/blog/new/" + id);
    else router.push("/blog/" + encodeURL(title));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await fetchAllBlogPosts(false);
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
      <HeaderContainer>
        <Heading as="h4" style={{ color: "white" }}>
          Blog DoiFrati.ro
        </Heading>
      </HeaderContainer>
      {posts?.length ? (
        <Container gutter={30}>
          {posts.map((blogPost) => {
            return (
              <div
                className="col"
                key={blogPost.id}
                onClick={() =>
                  handleNavigateToPage(blogPost.id, blogPost.title)
                }
              >
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
                  Te invităm să citești acest articol
                </Button>
              </div>
            );
          })}
        </Container>
      ) : (
        <ContainerFake>
          <Heading as="h3">
            Ne pare rau, dar momentan nu avem postari in blog. Vom adauga
            postari curand!
          </Heading>
        </ContainerFake>
      )}
    </>
  );
};

export default BlogPosts;
