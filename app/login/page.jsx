"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Checkbox } from "antd";
import { useRouter } from "next/navigation";

import { updateUserInfo } from "@/redux/userInfo/actionCreator";
import { AuthWrapper } from "@/components/style";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import theme from "@/components/atoms/theme";
import { errorReformatted } from "@/components/atoms/errorReformatted";

function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoading, error, isLogged } = useSelector((state) => {
    return {
      isLoading: state.userInfo.isLoading,
      error: state.userInfo.error,
      isLogged: state.userInfo.isLogged,
    };
  });

  const [form] = Form.useForm();

  const handleSubmit = async (v) => {
    dispatch(updateUserInfo({ ...v, loginMe: true }));
  };

  if (isLogged) router.back();

  return (
    <AuthWrapper>
      <Form name="login" form={form} onFinish={handleSubmit} layout="vertical">
        <Heading as="h3" style={{ marginBottom: 32 }}>
          Intră în contul tău
        </Heading>
        <Form.Item
          name="email"
          rules={[{ message: "", required: true }]}
          label="Adresa de email"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ message: "", required: true }]}
          label="Parola"
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item name="keepMeLogged" className="auth-form-action">
          <Checkbox>Păstrează-mă logat</Checkbox>
        </Form.Item>
        <Form.Item style={{ margin: 0, marginTop: 32 }}>
          <Button className="btn-signin" htmlType="submit" type="primary">
            {isLoading ? "Se încarcă..." : "Întră în contul tău"}
          </Button>
        </Form.Item>
        <div
          style={{
            display: "flex",
            width: "100",
            marginTop: 12,
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            type="primary"
            outlined
            onClick={() => {
              router.push("/am-uitat-parola");
            }}
          >
            Ai uitat parola?
          </Button>
          <Button
            type="primary"
            className="btn-signin"
            outlined
            onClick={() => {
              router.push("/creeaza-cont");
            }}
          >
            Încă nu ai un cont?
          </Button>
        </div>

        {error && (
          <Text
            as="p6"
            style={{ color: theme["secondary-color"], marginTop: 16 }}
          >
            {errorReformatted(error)}
          </Text>
        )}
      </Form>
    </AuthWrapper>
  );
}

export default SignInPage;
