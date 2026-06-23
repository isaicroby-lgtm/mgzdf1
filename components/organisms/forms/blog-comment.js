import { Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";

import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";

const BlogComment = ({ version, comment, handlePostComment, loading }) => {
  return (
    <Form
      layout="vertical"
      name="create-review"
      style={{ marginTop: 32 }}
      onFinish={handlePostComment}
    >
      <Heading as="h5" style={{ marginBottom: 32 }}>
        {version === "edit"
          ? `Creează un comentariu la postarea lui ${comment?.name}`
          : "Creează un comentariu"}
      </Heading>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Te rugam sa introduci o adresa de email valida.",
          },
          { required: true, message: "Ai uitat sa completezi acest camp" },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        label="Nume"
        name="name"
        rules={[
          { required: true, message: "Ai uitat sa completezi acest camp." },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        label="Comentariu"
        name="text"
        rules={[
          { required: true, message: "Ai uitat sa completezi acest camp." },
        ]}
      >
        <TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" loading={loading} outlined htmlType="submit">
          Publică
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BlogComment;
