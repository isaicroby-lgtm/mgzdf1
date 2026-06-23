"use client";

import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Checkbox } from "antd";
import { useRouter } from "next/navigation";

import { AuthWrapper } from "@/components/style";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import theme from "@/components/atoms/theme";

import { errorReformatted } from "@/components/atoms/errorReformatted";
import { isValidEmail } from "@/components/organisms/modals/modal-account";
import { createUser } from "@/api/account";
import actions from "@/redux/userInfo/actions";

const { updateUserInfoSuccess, updateUserInfoErr } = actions;

function CreateAccountPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoading, error, isLogged, userInfo } = useSelector((state) => {
    return {
      isLoading: state.userInfo.isLoading,
      error: state.userInfo.error,
      isLogged: state.userInfo.isLogged,
      userInfo: state.userInfo || {},
    };
  });

  const [form] = Form.useForm();

  const handleSubmit = async (v) => {
    if (isValidEmail(v.email)) {
      try {
        // console.log(userInfo);
        const account = await createUser(v);
        // console.log(userInfo);
        dispatch(updateUserInfoSuccess({ ...account, isLogged: true }));

        router.push("/");
      } catch (err) {
        // for (const [key, value] of Object.entries(err)) {
        //   console.log(key, value);
        // }

        dispatch(updateUserInfoErr(err));
      }
    } else {
      alert("Te rugam sa introduci o adresa de email valida!");
    }
  };

  return (
    <AuthWrapper>
      <Form
        name="login"
        form={form}
        onFinish={async (v) => {
          await handleSubmit(v);
        }}
        layout="vertical"
      >
        <Heading as="h3" style={{ marginBottom: 32 }}>
          Creează-ți un cont
        </Heading>
        <Form.Item
          name="firstName"
          rules={[{ message: "", required: true }]}
          label="Prenume"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="lastName"
          rules={[{ message: "", required: true }]}
          label="Nume de familie"
        >
          <Input size="large" />
        </Form.Item>
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
            {isLoading ? "Se încarcă..." : "Creează-ți contul"}
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
              router.push("/login");
            }}
          >
            Ai deja un cont?
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

export default CreateAccountPage;
