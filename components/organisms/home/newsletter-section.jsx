"use client";

import React from "react";
import styled from "styled-components";
import { Form } from "antd";
import FeatherIcon from "feather-icons-react";

import { subscribeToNewsletter } from "@/api/newsletter";
import Heading from "@/components/atoms/Heading";

const FormWithIFrame = styled(Form)`
  iframe {
    margin-top: -32px;
    border: 0;
    width: 580px;
    height: 320px;

    max-width: 98%;
  }
`;

const HeadingWithIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 34px;

  @media only screen and (max-width: 750px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HomeWrapper = styled.div`
  margin-top: 124px;
  width: 100%;
  position: relative;
  height: fit-content;

  padding: 0 20%;

  .success-text {
    padding-left: 10%;
  }

  @media only screen and (max-width: 750px) {
    padding: 0 2%;

    .success-text {
      padding-left: 0%;
    }
  }
`;

const NewsletterSection = () => {
  const handleSubscribe = async (values) => {
    await subscribeToNewsletter(values.email);
  };

  return (
    <HomeWrapper>
      <HeadingWithIcon>
        <FeatherIcon icon="mail" size={98} height={"fit-content"} />
        <Heading as="h4">
          Alătură-te newsletterului nostru pentru a nu rata reduceri de până la
          25%, jucării și produse noi, dar și produsul lunii următoare!
        </Heading>
      </HeadingWithIcon>

      <FormWithIFrame
        onFinish={handleSubscribe}
        onFinishFailed={() => {
          alert(
            "Hei! Pentru a te putea abona la newsletterul nostru va trebui să introduci o adresă de email valabilă și să ne dai permisiunea de a te contacta"
          );
        }}
      >
        <iframe src="https://cdn.forms-content-1.sg-form.com/4abb1734-466b-11ee-a760-9a80a12bcbfa" />
      </FormWithIFrame>
    </HomeWrapper>
  );
};

export default NewsletterSection;
