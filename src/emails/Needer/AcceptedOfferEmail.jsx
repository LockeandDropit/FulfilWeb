import {
  Button,
  Container,
  Html,
  Tailwind,
  Body,
  Heading,
  Text,
  Head,
} from "@react-email/components";
import * as React from "react";

export default function AcceptedOfferEmail() {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {},
        },
      }}
    >
      <Head />
      <Body className="p-4 font-sans mx-auto">
        <Container className="p-4">
          <Text className=" text-4xl font-sans font-bold text-sky-400 mx-auto">
            Fulfil
          </Text>
          <Text className="font-sans mx-auto">Hey (Name Here),</Text>
          <Text className="font-sans">
            (Senders name here) has completed work on (JOB NAME HERE)!
          </Text>
          <Text className="font-sans">
            Click the link below or visit your dashboard to pay them.
          </Text>

          <Button
            type="button"
            className="py-2 cursor-pointer px-4 inline-flex items-center gap-x-2 font-sans text-sm font-semibold rounded-md border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
            href="https://getfulfil.com"
          >
            pay now
          </Button>
        </Container>
      </Body>
    </Tailwind>
  );
}
