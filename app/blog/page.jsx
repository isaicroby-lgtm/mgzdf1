import { getMetadata } from "@/api/seoSsr";
import dynamic from "next/dynamic";

const BlogPosts = dynamic(()=>import("@/components/organisms/blog/blog-posts"), {ssr: false});

const BlogPage = () => {
  return <>
    <BlogPosts/>
  </>
};

export async function generateMetadata({ params }) {
  
  const metadata = await getMetadata("blog");
  return metadata;
}

export default BlogPage;
