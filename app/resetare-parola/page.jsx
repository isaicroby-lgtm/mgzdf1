"use client";

import React, { useState } from "react";
import { Form, Input } from "antd";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import { AuthWrapper } from "@/components/style";
import Button from "@/components/atoms/Button";
import { auth } from "@/public/firebase";

function ResetPasswordPage() {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);
    if (password.length >= 6) {
      const oob = searchParams.get("oobCode");
      verifyPasswordResetCode(auth, oob)
        .then((email) => {
          confirmPasswordReset(auth, oob, password)
            .then((res) => {
              router.push("/login?from-reset");
              setLoading(false);
            })
            .catch((err) => {
              alert("Link invalid");
              setLoading(false);
            });
        })
        .catch((err) => {
          alert("Link invalid");
          setLoading(false);
        });
    } else {
      alert("Parola trebuie să conțină minim 6 caractere");
      setLoading(false);
    }
  };
  const steps = [
    <Form
      key={"step0"}
      name="forgotPass"
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Heading as="h3">Resetare parolă</Heading>
      <Text as="p5" style={{ marginTop: 16, marginBottom: 16 }}>
        Introduce-ți noua parolă a contului de minim 6 caractere
      </Text>
      <Form.Item
        name="password"
        rules={[{ message: "", required: true }]}
        label="Parola nouă"
      >
        <Input.Password
          size="large"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type="password"
        />
      </Form.Item>
      <Form.Item>
        <Button
          disabled={loading}
          className="btn-reset"
          htmlType="submit"
          type="primary"
          size="large"
        >
          Resetează parola
        </Button>
      </Form.Item>
    </Form>,
    <div key={"step1"}>
      <Heading as="h3">Parolă resetată cu succes</Heading>
      <Text as="p5" style={{ marginTop: 16, marginBottom: 16 }}>
        Verifică inboxul pentru link-ul de resetare al parolei. Nu uita de
        folderul de spam. Vă urăm o zi bună :/
      </Text>
      <p className="return-text">
        Întoarce-te la <Link href="/login">Login</Link>
      </p>
    </div>,
  ];

  return <AuthWrapper>{steps[step]}</AuthWrapper>;
}

export default ResetPasswordPage;
