"use client";

import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";
import { BasicWrapperForLegal } from "@/components/atoms/other-styled-components";
import { useSearchParams } from "next/navigation";

const CardPaymentForm = (props) => {
  const search_params = useSearchParams();

  const env_key = search_params.get("envKey");
  const url = search_params.get("url");
  const data = search_params.get("data");

  return (
    <>
      <BasicWrapperForLegal style={{ justifyContent: "flex-start" }}>
        <form name="frmPaymentRedirect" method="post" action={url}>
          <input type="hidden" name="env_key" value={env_key} />
          <input type="hidden" name="data" value={data} />
          <Heading as="h4">
            Apasa mai jos pentru a fi redirectionat catre o pagina sigura pe
            mobilepay.ro
          </Heading>
          <Button
            type="primary"
            htmlType="submit"
            value="Submit"
            style={{ marginTop: 8 }}
          >
            Continua
          </Button>
        </form>
      </BasicWrapperForLegal>
    </>
  );
};

export default CardPaymentForm;
