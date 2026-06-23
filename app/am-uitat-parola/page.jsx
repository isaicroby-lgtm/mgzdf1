"use client";

import React, { useState } from "react";
import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { auth } from "@/public/firebase";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import { AuthWrapper } from "@/components/style";
import Button from "@/components/atoms/Button";

function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const { isLoading, isLogged } = useSelector((state) => {
    return {
      isLoading: state.userInfo.isLoading,
      error: state.userInfo.error,
      isLogged: state.userInfo.isLogged,
    };
  });

  const handleSubmit = () => {
    if (email) {
      sendPasswordResetEmail(auth, email).catch((error) => {
        console.log(error);
      });
      setStep(1);
    }
  };
  const steps = [
    <Form
      key={"big-form"}
      name="forgotPass"
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Heading as="h3">Ți-ai uitat parola?</Heading>
      <Text as="p5" style={{ marginTop: 16, marginBottom: 16 }}>
        Introdu adresa de email cu care ți-ai făcut contul
      </Text>
      <Form.Item
        name="email"
        rules={[{ message: "", required: true }]}
        label="Adresa ta de email"
      >
        <Input
          size="large"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
      </Form.Item>
      <Form.Item style={{ margin: 0, marginTop: 32 }}>
        <Button className="btn-signin" htmlType="submit" type="primary">
          {isLoading ? "Se încarcă..." : "Trimite-mi instrucțiunile"}
        </Button>
      </Form.Item>
      <div
        style={{
          display: "flex",
          width: "100",
          marginTop: 12,
          gap: 12,
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          outlined
          onClick={() => {
            router.push("/login");
          }}
        >
          Logare
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
    </Form>,
    <div key="big-div">
      <Heading as="h3">Cerere trimisă la {email}</Heading>
      <Text as="p5" style={{ marginTop: 16, marginBottom: 16 }}>
        Verifică inboxul pentru link-ul de resetare al parolei. Nu uita de
        folderul de spam. Vă urăm o zi bună! 😃
      </Text>
      {!isLogged && (
        <p className="return-text">
          Întoarce-te la <Link href="/login">Login</Link>
        </p>
      )}
    </div>,
  ];

  return <AuthWrapper>{steps[step]}</AuthWrapper>;
}

export default ForgotPassword;
