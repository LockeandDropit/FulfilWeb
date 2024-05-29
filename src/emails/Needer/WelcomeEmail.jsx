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

export default function WelcomeEmail() {
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
          <Text className="font-sans mx-auto">Welcome to Fulfil!</Text>
          <Text className="font-sans">
            The easiest way to get started is to post a job or to browse our
            contractors.
          </Text>
          <Text className="font-sans">
            Posting a job takes less than 2 minutes, and you can have
            contractors applying within no time.
          </Text>
          <Text className="font-sans">
            No more getting bombarded with phone calls from multiple
            contractors. Easily manage and sort through the applicants via your
            dashboard and select the one you want to hire.
          </Text>

          <Button
            type="button"
            className="py-2 cursor-pointer px-4 inline-flex items-center gap-x-2 font-sans text-sm font-semibold rounded-md border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
            href="https://getfulfil.com"
          >
            Post my job
          </Button>
        </Container>
      </Body>
    </Tailwind>
  );
}
