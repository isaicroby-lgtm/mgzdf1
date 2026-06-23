import React from "react";
import dynamic from "next/dynamic";

const IndBlogAdmin = dynamic(
  () => import("@/components/organisms/admin/ind-blog-admin"),
  {
    ssr: false,
  }
);

const BlogIndividualPage = ({ params }) => {
  const { blogId } = params;

  return (
    <>
      <IndBlogAdmin blogId={blogId} />
    </>
  );
};

export default BlogIndividualPage;
