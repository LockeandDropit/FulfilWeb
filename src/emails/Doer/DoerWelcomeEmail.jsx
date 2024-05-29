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

export default function DoerWelcomeEmail() {
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
          <Text className="font-sans">Finding work is easy when you see it right in front of you.</Text>
          <Text className="font-sans">
           Visit your dashboard and browse jobs close to you, apply to the ones you want! (Hint: make sure you fill out your profile so customers know your strengths!)
          </Text>

          <Button
            type="button"
            className="py-2 cursor-pointer px-4 inline-flex items-center gap-x-2 font-sans text-sm font-semibold rounded-md border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
            href="https://getfulfil.com"
          >
            Find work
          </Button>
        </Container>
      </Body>
    </Tailwind>
  );
}
