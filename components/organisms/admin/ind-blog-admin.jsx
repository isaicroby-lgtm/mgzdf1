"use client";

import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { Form, Input, message, Select, Checkbox } from "antd";
import dayjs from "dayjs";

import { serverTimestamp } from "firebase/firestore";
import TextArea from "antd/lib/input/TextArea";
import Dragger from "antd/lib/upload/Dragger";
import { useRouter } from "next/navigation";
import Editor from "ckeditor5-cb/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  createBlogFirestore,
  deleteComment,
  fetchAllPostComments,
  fetchBlogPost,
  postComment,
  updateBlogPost,
} from "@/api/blog";
import { Main } from "@/components/style";
import PageHeader from "@/components/atoms/PageHeader";
import theme from "@/components/atoms/theme";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import Modal from "@/components/atoms/Modal";

const IndBlogAdmin = ({ blogId: id }) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [coverImg, setCoverImg] = useState([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState();
  const [post, setPost] = useState();

  const [sendEmail, setSendEmail] = useState(false);

  const [status, setStatus] = useState("");
  const [blogComments, setBlogComments] = useState([]);
  const [openPosition, setOpenPosition] = useState();
  const [loading, setLoading] = useState(false);

  const coverImgProps = {
    name: "file",
    multiple: false,
    accept: ".jpg, .png",
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "removed") {
        if (!coverImg.length || coverImg.length === 1) {
          form.setFieldValue("cover-img", null);
          setCoverImg(info.fileList);
        } else {
          setCoverImg(info.fileList);
        }
      } else {
        form.setFieldValue("cover-img", info.file);
        form.validateFields(["cover-img"]);
        setCoverImg(info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} fisierul a fost uploadat cu succes`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} fisierul nu a fost uploadat. A aparut o eroare`
        );
      }
    },
    listType: "picture",
    fileList: coverImg.map((file, i) => ({
      ...file,
      url: file.fileDownloadURL,
      thumbUrl: file.fileDownloadURL,
      status: "done",
      uid: file.fileDownloadURL,
    })),
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" onClick={(e) => {}} />,
    },
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);

    if (!(id && post))
      try {
        await createBlogFirestore(values, coverImg[0]).then(() =>
          router.push("/admin/blog")
        );
      } catch (e) {
        alert(e);
      } finally {
        setIsLoading(false);
      }
    else
      try {
        await updateBlogPost(
          id,
          { ...values, sendEmail },
          coverImg[0] || null
        ).then(() => router.push("/admin/blog"));
      } catch (e) {
        alert(e);
      } finally {
        setIsLoading(false);
      }
  };

  const handleSubmitFailed = async (errInfo) => {
    const { values } = errInfo;
    if (values.status === "draft") handleSubmit(values);
  };

  const handlePostComment = async (values) => {
    setLoading(true);
    const comment = {
      ...values,
      timestamp: serverTimestamp(),
      postId: id,
      parentId: openPosition,
      approved: true,
      admin: true,
    };
    await postComment(comment);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      const checkPostExistence = async () => {
        const blogPost = await fetchBlogPost(id);
        if (blogPost != null) {
          setPost(blogPost);
        } else router.push("/admin/blog/");
      };
      checkPostExistence();
    }
  }, [id]);

  useEffect(() => {
    form.setFieldsValue(post);
    setStatus(post?.status);
  }, [form, post]);

  useEffect(() => {
    const _fetchAllPostComments = async () => {
      setBlogComments(await fetchAllPostComments(id));
    };
    if (id) _fetchAllPostComments();
  }, [id]);

  return (
    <>
      <PageHeader title={id && post ? "Date postare" : "Creează postare"} />

      <Modal
        title={"Esti sigur ca vrei sa stergi acest comentariu?"}
        visible={!!confirmDeleteModal}
        onCancel={() => setConfirmDeleteModal()}
        onOk={async () => {
          try {
            if (confirmDeleteModal?.nm === "comment") {
              setBlogComments((prev) =>
                prev.filter((b) => b.id !== confirmDeleteModal?.comment?.id)
              );
              await deleteComment(confirmDeleteModal?.comment?.id);
            } else if (confirmDeleteModal?.nm === "response") {
              setBlogComments((prev) => {
                const prevBlogComm = [...prev];
                const commIndex = prevBlogComm.findIndex(
                  (x) => x.id === confirmDeleteModal.id
                );

                prevBlogComm[commIndex].replies = prevBlogComm[
                  commIndex
                ].replies.filter((x) => x.id !== confirmDeleteModal?.reply?.id);

                return prevBlogComm;
              });

              await deleteComment(confirmDeleteModal?.reply?.id);
            }
          } catch (error) {
            console.log(error);
            alert(error);
          } finally {
            setConfirmDeleteModal();
          }
        }}
      />

      <Main theme={theme}>
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={handleSubmit}
          onFinishFailed={handleSubmitFailed}
          initialValues={{ ...post }}
        >
          <Form.Item
            label="Titlu"
            name="title"
            rules={[
              { required: true, message: "Cum vrei să se numească postarea?" },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select
              defaultValue="draft"
              style={{
                width: 120,
              }}
              value={form.getFieldValue("status")}
              onChange={(value) => {
                form.setFieldValue("status", value);
                setStatus(value);
              }}
              options={[
                {
                  value: "draft",
                  label: "In editare",
                },
                {
                  value: "published",
                  label: "Publica",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Categorie"
            name="category"
            rules={[
              {
                required: true,
                message: "Din ce categorie face parte postarea?",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Sumar"
            name="summary"
            rules={[
              { required: true, message: "Pe scurt, despre ce e postarea?" },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label={"Imagine principală" + (id && post ? " nouă" : "")}
            name="cover-img"
            rules={[
              {
                required: !(id && post),
                message: "Alegeți o imagine principală",
              },
            ]}
          >
            <Dragger {...coverImgProps}>
              <p className="ant-upload-drag-icon">
                <FeatherIcon icon="upload" size={40} />
              </p>
              <Heading as="h4" className="ant-upload-text">
                Trage o imagine aici
              </Heading>
              <p className="ant-upload-hint">
                Sau <span>apasă</span> pentru a alege un fișier
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item
            label="Continut"
            name="content"
            rules={[
              {
                required: "true",
                message: "Camp obligatoriu",
              },
            ]}
          >
            <CKEditor
              editor={Editor}
              data={form.getFieldValue("content")}
              onChange={(event, editor) => {
                const data = editor.getData();
                form.setFieldValue("content", data);
              }}
            />
          </Form.Item>

          {status === "published" && !post?.sentEmail && (
            <>
              <Form.Item label="Email la newsletter">
                <Checkbox
                  style={{ marginTop: 4 }}
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                />
              </Form.Item>
              {sendEmail && (
                <>
                  <Form.Item
                    label="Subiect email"
                    name="emailSubject"
                    rules={[
                      {
                        required: sendEmail,
                        message: "",
                      },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="emailBody"
                    rules={[
                      {
                        required: sendEmail,
                        message: "Camp obligatoriu",
                      },
                    ]}
                  >
                    <CKEditor
                      editor={Editor}
                      data={form.getFieldValue("emailBody")}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        form.setFieldValue("emailBody", data);
                      }}
                    />
                  </Form.Item>
                </>
              )}
            </>
          )}
          <Form.Item
            wrapperCol={{
              offset: 4,
            }}
          >
            <Button
              loading={isLoading}
              type="primary"
              outlined
              htmlType="submit"
            >
              {id && post ? "Aplică modificările" : "Creează postare"}
            </Button>
          </Form.Item>
        </Form>

        {id && post ? (
          <div style={{ marginTop: 64 }}>
            <Heading as="h4">
              Aproba, raspunde, sau sterge comentarii la aceasta postare. Nr
              comentarii: {blogComments?.length}
            </Heading>

            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 16,
                }}
              >
                {blogComments?.map((comment) => {
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
                            <FeatherIcon
                              style={{
                                borderRadius: "50%",
                                width: 46,
                                height: 24,
                              }}
                              icon="user"
                            />
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
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
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                columnGap: 24,
                                rowGap: 4,
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 8,
                              }}
                            >
                              <Text
                                as="p4"
                                style={{
                                  color: theme["primary-color"],
                                  cursor: "pointer",
                                }}
                                onClick={() => setOpenPosition(comment.id)}
                              >
                                Posteaza un comentariu la acest comentariu
                              </Text>
                              <Text
                                as="p4"
                                style={{
                                  cursor: "pointer",
                                  color: theme["success-color"],
                                }}
                                onClick={async () => {
                                  if (comment && !comment.approved) {
                                    setBlogComments((prev) => {
                                      const prevBlogComm = [...prev];
                                      const commIndex = prevBlogComm.findIndex(
                                        (x) => x.id === comment.id
                                      );

                                      prevBlogComm[commIndex].approved = true;

                                      return prevBlogComm;
                                    });

                                    await approveComment(comment.id);
                                  } else
                                    alert("Comentariul a fost aprobat deja");
                                }}
                              >
                                {comment.approved
                                  ? "Comentariul a fost aprobat"
                                  : "Aproba acest comentariu"}
                              </Text>
                              <Text
                                as="p4"
                                style={{
                                  cursor: "pointer",
                                  color: theme["secondary-color"],
                                }}
                                onClick={() =>
                                  setConfirmDeleteModal((prev) => ({
                                    ...prev,
                                    nm: "comment",
                                    comment,
                                  }))
                                }
                              >
                                Sterge acest comentariu
                              </Text>
                            </div>
                          </div>
                        </div>
                        <Text as="p5">
                          {dayjs(comment.timestamp.toDate())
                            .format("DD/MM/YYYY")
                            .toString()}
                        </Text>
                      </div>

                      {openPosition && comment.id === openPosition && (
                        <Form
                          style={{ marginTop: 32 }}
                          layout="vertical"
                          name="create-blog-comment"
                          onFinish={handlePostComment}
                        >
                          <Heading as="h5" style={{ marginBottom: 32 }}>
                            Creează un comentariu la postarea lui{" "}
                            {comment?.name}
                          </Heading>
                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                              {
                                required: true,
                                type: "email",
                                message:
                                  "Te rugam sa introduci o adresa de email valida.",
                              },
                              {
                                required: true,
                                message: "Ai uitat sa completezi acest camp",
                              },
                            ]}
                          >
                            <Input size="large" />
                          </Form.Item>
                          <Form.Item
                            label="Nume"
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: "Ai uitat sa completezi acest camp.",
                              },
                            ]}
                          >
                            <Input size="large" />
                          </Form.Item>
                          <Form.Item
                            label="Comentariu"
                            name="text"
                            rules={[
                              {
                                required: true,
                                message: "Ai uitat sa completezi acest camp.",
                              },
                            ]}
                          >
                            <TextArea />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              type="primary"
                              loading={loading}
                              outlined
                              htmlType="submit"
                            >
                              Publică
                            </Button>
                          </Form.Item>
                        </Form>
                      )}

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
                                    backgroundColor:
                                      theme["border-color-light"],
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
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      columnGap: 24,
                                      rowGap: 4,
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginTop: 8,
                                    }}
                                  >
                                    <Text
                                      as="p5"
                                      style={{
                                        cursor: "pointer",
                                        color: theme["success-color"],
                                      }}
                                      onClick={async () => {
                                        if (reply && !reply.approved) {
                                          setBlogComments((prev) => {
                                            const prevBlogComm = [...prev];
                                            const commIndex =
                                              prevBlogComm.findIndex(
                                                (x) => x.id === comment.id
                                              );
                                            const repp =
                                              comment.replies?.findIndex(
                                                (x) => x.id === reply.id
                                              );

                                            prevBlogComm[commIndex].replies[
                                              repp
                                            ].approved = true;

                                            return prevBlogComm;
                                          });
                                          await approveComment(reply.id);
                                        } else
                                          alert(
                                            "Raspunsul a fost aprobat deja"
                                          );
                                      }}
                                    >
                                      {reply.approved
                                        ? "Raspunsul a fost aprobat"
                                        : "Aproba acest raspuns"}
                                    </Text>
                                    <Text
                                      as="p5"
                                      style={{
                                        cursor: "pointer",
                                        color: theme["secondary-color"],
                                      }}
                                      onClick={() => {
                                        setConfirmDeleteModal((prev) => ({
                                          ...prev,
                                          nm: "response",
                                          reply,
                                        }));
                                      }}
                                    >
                                      Sterge acest raspuns
                                    </Text>
                                  </div>
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
              </div>
            </div>
          </div>
        ) : null}
      </Main>
    </>
  );
};

export default IndBlogAdmin;
