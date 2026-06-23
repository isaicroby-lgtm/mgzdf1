import React from "react";
import dynamic from "next/dynamic";

const IndBlogPost = dynamic(
  () => import("@/components/organisms/client-pages/ind-blog-post"),
  { ssr: false }
);

const IndBlogPostPage = ({ params }) => {
  const { blogName } = params;
  return (
    <>
      <IndBlogPost blogName={blogName} />
    </>
  );
};

export async function generateMetadata({ params }) {
  const { blogName } = params;

  const metadata = fetch('https://api-ekfyledvua-ew.a.run.app/blog_metadata/'+blogName).then((response) => {
    if(response.status !== 200)
      return {};
    return response.json();
  });

  return metadata;
}

export default IndBlogPostPage;
