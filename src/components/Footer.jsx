"use client";

import { ReactNode, useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  Image,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Center,
} from "@chakra-ui/react";
import fulfil180 from "../images/fulfil180.jpg";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";
const Logo = () => {
  //template credit https://chakra-templates.vercel.app/page-sections/footer
  return <Image src={fulfil180}></Image>;
};

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export default function LargeWithLogoLeft() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenTOS,
    onOpen: onOpenTOS,
    onClose: onCloseTOS,
  } = useDisclosure();
  const {
    isOpen: isOpenContact,
    onOpen: onOpenContact,
    onClose: onCloseContact,
  } = useDisclosure();
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [emailValidationBegun, setEmailValidationBegun] = useState(false);
  const [validationMessage, setValidationMessage] = useState();
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  const [issueID, setIssueID] = useState(null);

useEffect(() => {
    setIssueID(uuidv4());
},[])


  const submitMessage = () => {


    setTimeout(() => {
      if (!message) {
        alert("Please fill out all fields before submitting");
      } else {
        setDoc(doc(db, "Complaints", issueID), {
          name: name,
          email: email,
          message: message,
        })
          .then(() => {
            setIssueSubmitted(true);
          })
          .catch((error) => {
            console.log(error)
          });

          setIssueSubmitted(true);
      }
    }, 500);
  };

  const validate = () => {
    setEmailValidationBegun(true);
    const isValid = emailRegex.test(email);
    if (!isValid) {
      setValidationMessage("Please enter a valid email");
    } else {
      setValidationMessage();
      setEmail(email);
      submitMessage();
    }
  };

const fbURL = "https://www.facebook.com/profile.php?id=61557901443175&mibextid=PINXYD"

const handleOpenFBPage = () => {
    window.open(fbURL, "_blank")
}


  return (
    <>
      {/* <Box marginTop="40px" borderTopWidth="2px" borderTopColor="#e1e1e1">
        <Container as={Stack} maxW={"70vw"} py={10}>
          <SimpleGrid
            templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 1fr 1fr" }}
            spacing={8}
          >
            <Stack spacing={6}>
              <Box>
                <Logo color={useColorModeValue("gray.700", "white")} />
              </Box>
              <Text fontSize={"sm"}>
                © 2024 Fulfil Inc. All rights reserved
              </Text>
            </Stack>

            <Stack align={"flex-start"}>
              <ListHeader >Support</ListHeader>
              <Box as="button" onClick={() => onOpenContact()}>
                Contact Us
              </Box>
              <Box as="button" onClick={() => onOpenTOS()}>
                Terms of Service
              </Box>

              <Box as="button" onClick={() => onOpen()}>
                Privacy Policy
              </Box>
            </Stack>
            <Stack align={"flex-start"}>
              <ListHeader>Follow Us</ListHeader>
              <Box as="button" onClick={() => handleOpenFBPage()}>
                Facebook
              </Box>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box> */}
      <footer class="mt-auto bg-white w-full ">
  <div class="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div class="col-span-full lg:col-span-1">
      <a
                  class="flex-none text-4xl font-sans font-bold text-sky-400 cursor-pointer"
                  aria-label="Brand"
               
                >
                  Fulfil
                </a>
      </div>
   

      <div class="col-span-1">
        <h4 class="font-semibold text-gray-800">Social</h4>

        <div class="mt-3 grid space-y-3">
        <p><a class="inline-flex gap-x-2 text-gray-800 hover:text-gray-900 cursor-pointer"  onClick={() => handleOpenFBPage()}>Facebook</a></p>
        </div>
      </div>
  

      <div class="col-span-1">
        <h4 class="font-semibold text-gray-800">Company</h4>

        <div class="mt-3 grid space-y-3">
        <p><a class="inline-flex gap-x-2 text-gray-800 hover:text-gray-900 cursor-pointer"  onClick={() => onOpen()}>Privacy Policy</a></p>
        </div>
      </div>
     

      <div class="col-span-2">
        <h4 class="font-semibold text-gray-800">Support</h4>
        <div class="mt-3 grid space-y-3">
        <p><a class="inline-flex gap-x-2 text-gray-800 hover:text-gray-900 cursor-pointer"  onClick={() => onOpenContact()}>Contact us</a></p>
        <p><a class="inline-flex gap-x-2 text-gray-800 hover:text-gray-900 cursor-pointer" onClick={() => onOpenTOS()}>Terms of Service</a></p>

      </div>
      </div>
     
    </div>
  

    <div class="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center">
      <div class="flex justify-between items-center">
        <p class="text-sm text-gray-400 ">© 2024 Fulfil Inc. All rights reserved.</p>
      </div>
    

    
      <div>
        <a class="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600" href="#">
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
          </svg>
        </a>
        <a class="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600" href="#">
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
          </svg>
        </a>
        <a class="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600" href="#">
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
          </svg>
        </a>
        <a class="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600" href="#">
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
        <a class="size-10 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600" href="#">
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111C0 9.186.756 8.43 1.68 8.43h1.682v1.68zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68v-4.21zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682H5.89zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682h4.21zm6.749 1.682c0-.926.755-1.682 1.68-1.682.925 0 1.681.756 1.681 1.681s-.756 1.681-1.68 1.681h-1.681V5.89zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68v4.21zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68 0-.925.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681h-4.21z"/>
          </svg>
        </a>
      </div>
   
    </div>
  </div>
</footer>

      <Modal isOpen={isOpenContact} onClose={onCloseContact} size="xl">
        <ModalOverlay />
        <ModalContent height="66vh">
          <ModalHeader fontSize="16px">Contact Us</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="scroll">
            {issueSubmitted ? (
              <Center>
                <Text>
                  Your message has been sent! We will contact you in the next 48
                  hours.
                </Text>
              </Center>
            ) : (
              <>
                <FormControl>
                  <FormLabel>Your Name</FormLabel>
                  <Input
                    marginBottom="4px"
                    borderWidth=".5px"
                    borderColor="grey"
                    onChange={(e) => setName(e.target.value)}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    borderColor="grey"
                    borderWidth=".25px"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailValidationBegun === true ? (
                    <Text color="red">{validationMessage}</Text>
                  ) : null}
                </FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea
                  height="240px"
                  borderWidth=".5px"
                  borderColor="grey"
                  onChange={(e) => setMessage(e.target.value)}
                ></Textarea>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseContact}>
              Close
            </Button>
            <Button colorScheme="blue" mr={3} onClick={() => validate()}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent height="66vh">
          <ModalHeader fontSize="16px">Privacy Policy</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="scroll">
            <Text marginTop="8">
              Last Updated: [07/28/23] FULFIL INC. PRIVACY POLICY This policy
              explains our information practices, defines your privacy options
              and describes how your information is collected and used. This
              policy covers the websites and the various mobile, web and desktop
              applications (collectively the “Applications”) made available by
              FULFIL Inc. (“FULFIL”). The FULFIL Website and the Applications
              are owned and operated by FULFIL, a company organized under the
              laws of Minnesota. Should you have privacy questions or concerns,
              send an email to fulfilhelp@gmail.com. By using or visiting the
              FULFIL Website or using the Applications, you agree to the
              collection and use of information in the manner described in this
              policy. If we make material changes to this policy, we will notify
              you by email, by means of a notice the next time you log in to the
              FULFIL Website, by means of a notice on the FULFIL Website
              homepage or when you next activate the Application. Such revisions
              and additions shall be effective immediately upon notice. You are
              responsible for reviewing the FULFIL Website or Applications
              periodically for any modification to this policy. Any access or
              use of the FULFIL Website or Applications by you after notice of
              modifications to this policy shall constitute and be deemed to be
              your agreement to such modifications. THE INFORMATION WE COLLECT
              This policy applies to all information collected on the FULFIL
              Website, any information you provide to FULFIL and any information
              that results from your use of Applications. You will most likely
              provide us personal information to us when you register as a user
              of FULFIL Website, license and then use the Applications or
              participate in certain FULFIL promotions or events. The personal
              information we may collect might include passwords, user names,
              addresses, email addresses, phone numbers, bank information and
              credit/debit card numbers. THE APPLICATIONS Use of the
              Applications is subject to the terms and conditions of the
              Application Terms of Use. BLOGS AND PRODUCT REVIEWS The FULFIL
              Website or Applications may include blogs, product reviews or
              other message areas that allow users to post or send information
              to the FULFIL Website or the Applications. When you post
              information to the FULFIL Website or Applications, others can also
              view that information. We urge you to exercise caution when
              providing personally identifiable information to FULFIL, FULFIL
              Website or the Applications. OUR COLLECTION OF YOUR DATA In
              addition to the personal information you supply, we may collect
              certain information to (1) evaluate how visitors, guests, and
              customers use the FULFIL Website or the Applications; or (2)
              provide you with personalized information or offers. We collect
              data to make the FULFIL Website and Applications work better for
              you in the following ways: to improve the design of the FULFIL
              Website and Applications, to provide personalization on the FULFIL
              Website and Applications and to evaluate the performance of our
              marketing programs. The technologies we may use to gather this
              non- personal information may include “IP” addresses, “cookies”,
              browser detection, “weblogs” and various “geo-location” tools. HOW
              WE COLLECT AND USE INFORMATION Our primary goal in collecting your
              information is to provide you with a personalized, relevant, and
              positive experience with the FULFIL Website and Applications. You
              can register on the FULFIL Website or the Applications to receive
              Promotions and updates, or to be contacted for market research
              purposes. You can control your privacy preferences regarding such
              marketing communications (see the section below entitled “Your
              Privacy Preferences”). From time to time, you may be invited to
              participate in optional customer surveys or promotions, and FULFIL
              may request that you provide some or all the above listed personal
              information in those surveys or promotions. We use information
              collected from surveys and promotions to learn about our customers
              to improve our services and develop new products and services of
              interest to our customers. IP addresses define the Internet
              location of computers and help us better understand the geographic
              distribution of our visitors and customers and manage the
              performance of the FULFIL Website. Cookies are tiny files placed
              onto the hard drive of your computer when you visit the FULFIL
              Website, so we can immediately recognize you when you return to
              the FULFIL Website and deliver content specific to your interests.
              You may modify your browser preferences to accept all cookies, be
              notified when a cookie is set, or reject all cookies. Please
              consult your browser instructions for information on how to modify
              your choices about cookies. If you modify your browser
              preferences, certain features of the FULFIL Website may not be
              available to you. We may detect the type of web browser you are
              using to optimize the performance of the FULFIL Website and to
              understand the mix of browsers used by our visitors, guests, and
              customers. To learn about how people use our site, we examine
              weblogs, which show the paths people take through the FULFIL
              Website and how long they spend in certain areas. The Applications
              may include the ability to link certain geographical information
              made available by us with your physical location. When you use the
              Applications, the Applications may know, in very general terms,
              your current physical location. To the extent that your physical
              location can be determined by the Applications, we may use your
              location to make available information to you that is relevant
              because of your physical location. We may also compile certain
              general information related to your use of the FULFIL Website and
              Applications. You agree that we are authorized to use, reproduce
              and generally make such information available to third parties in
              the aggregate, provided that your information shall not include
              personally identifiable information about you or be attributable
              to you. FULFIL may contract with unaffiliated third parties to
              provide services such as customer communications, website hosting,
              data storage, analytics and other services. When we do this, we
              may provide your personally identifiable information to third
              parties only to provide those services, and they are not
              authorized to use your personally identifiable information for any
              other purpose. OUR COMMITMENT TO DATA SECURITY Access to your
              personal data is limited to authorized FULFIL staff or approved
              vendors. Although total security does not exist on the Internet or
              through mobile networks, FULFIL shall make commercially reasonable
              efforts to safeguard the information that you submit to FULFIL.
              USE OF THE FULFIL WEBSITE AND APPLICATIONS BY CHILDREN THE FULFIL
              WEBSITE AND THE APPLICATIONS ARE NOT INTENDED FOR USE BY CHILDREN
              UNDER THE AGE OF 13. YOUR PRIVACY PREFERENCES When you sign up as
              a registered user of the FULFIL Website or Applications you may
              begin receiving marketing communications such as e-mail
              newsletters, product and service updates and promotions. Our
              customers generally find this type of information useful. If you
              do not want to receive these updates, you must “opt-out” by
              unchecking the “Add me to the mailing list” box on the
              registration page, or should you choose to opt-out after
              registering, you can select the “unsubscribe” link at the bottom
              of the email and follow the opt-out instructions or send an email
              to privacy@[URL].com/unsubscribe. HOW TO ACCESS, REVIEW, CORRECT
              OR DELETE YOUR INFORMATION Send FULFIL an email at
              privacy@[URL].com if you want to access, review, correct or delete
              your personally identifiable information collected by FULFIL. To
              protect your privacy and security, FULFIL requires a user ID and
              password to verify your identity before granting you the right to
              access, review or make corrections to your personally identifiable
              information. FULFIL may be required by law to retain certain of
              your personal information; if this is the case, you may not be
              able to correct or delete all your personal information.
              DISCLOSURE OF INFORMATION We reserve the right to disclose your
              personally identifiable information as required by law and when we
              believe that disclosure is necessary to protect our rights and/or
              comply with a judicial proceeding, court order or legal process.
              It is also possible that FULFIL would sell its business (by
              merger, acquisition, reorganization or otherwise) or sell all or
              substantially all its assets. In any transaction of this kind,
              customer information, including your personally identifiable
              information, may be among the assets that are transferred. If we
              decide to so transfer your personally identifiable information,
              you will be notified by an email sent to the last know email
              address in our files, by notice posted on the FULFIL Website or
              when you activate the Applications. PRIVACY AND OTHER WEBSITES AND
              APPLICATIONS The FULFIL Website or the Applications may contain
              links to other websites or other mobile applications. FULFIL is
              not responsible for the privacy practices of these other sites or
              applications. This policy only applies to information collected by
              FULFIL.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenTOS} onClose={onCloseTOS} size="xl">
        <ModalOverlay />
        <ModalContent height="66vh">
          <ModalHeader fontSize="16px">Terms Of Use</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="scroll">
            <Text marginTop="8">
              Fulfil Global Terms of Service Last updated 10/18/2023 These Terms
              of Service reprsesent a binding agreement between you and Fulfil,
              Inc. (“Fulfil”) concerning your use of the Fulfil Platform. The
              Fulfil Platform encompasses Fulfil's websites, mobile
              applications, and associated services and content. All personal
              data you provide to the Fulfil Platform, or that we gather, is
              subject to our Global Privacy Policy ("Privacy Policy"). By
              utilizing the Fulfil Platform, you confirm that you've reviewed
              our Privacy Policy. By acknowledging the Terms of Service and/or
              using the Fulfil platform, you expressly confirm that you have
              read, understand, and unconditionally agree to be bound by this
              Agreement and all of its terms. If you do not accept and agree to
              be bound by this Agreement, you must not use or access the Fulfil
              platform No agency, partnership, joint venture, employer-employee
              or franchiser-franchisee relationship is intended or created by
              this Agreement. The Fulfil Platform: Connecting Doers and Needers
              The Fulfil Platform is a digital marketplace linking Needers
              seeking services and Doers offering them. Both Needers and Doers
              are termed "Users". When both parties agree on a task. Doers'
              Independent Status: Doers are independent contractors, not
              affiliates or employees of Fulfil. Fulfil merely acts as a bridge,
              linking service seekers (Needers) with providers (Doers) and does
              not undertake any tasks itself. Disclaimer: Fulfil doesn't
              oversee, direct, or control a Doer's work and disclaims any
              responsibility for their performance, ensuring neither quality nor
              compliance with laws or regulations. No Endorsement of Doers:
              References to a Doer's credentials or descriptions only indicate
              they've met registration processes or criteria on our platform and
              have received ratings from other users. Such labels aren't
              endorsements or guarantees by Fulfil about the Doer's skills,
              qualifications, or trustworthiness. Needers must make their
              judgments about Doers' suitability. Fulfil does not directly
              endorse any Doer. Limitations: Fulfil isn't liable for any
              interactions, quality, legality, or outcomes of tasks, nor does it
              vouch for the integrity or qualifications of Users. Fulfil doesn't
              guarantee the accuracy, timeliness, or reliability of services
              requested or provided by Users. 2. Contract between Users When a
              Needer and a Doer agree on a task's terms, they enter into a
              binding contract (the “Service Agreement”). This agreement
              comprises the terms in this Section 2, the terms agreed upon on
              the Fulfil Platform, and other accepted contractual terms, as long
              as they don't conflict with this Agreement or limit Fulfil’s
              rights. Importantly, Fulfil isn't a party to this Service
              Agreement and never has an employment relationship with Doers
              because of it. Needers must pay Doers in full using the payment
              methods specified on the Fulfil Platform, based on the agreed
              rates in the Service Agreement. All Users should adhere to both
              the Service Agreement and this overarching Agreement during task
              engagement and completion. 3. Doer Background Checks & User
              Responsibilities Doer Background Checks: Doers may undergo
              reviews, possibly including identity verification and criminal
              background checks, termed “Background Checks”. While Fulfil
              conducts these checks, it cannot guarantee the complete
              authenticity of a user's identity or background. It’s always
              recommended to use caution and common sense for safety, as you
              would with strangers. Fulfil won't be responsible for
              misrepresentations by users. Furthermore, neither Fulfil nor its
              associates are liable for user conduct. By using the platform, you
              release Fulfil and its affiliates from any claims related to user
              interactions. User Responsibilities: Users must: Be of legal age
              (e.g., 18+ in the U.S.) and capable of forming contracts. Agree to
              and abide by Fulfil's terms, privacy policy, and other related
              guidelines. Only operate in regions where Fulfil is present.
              Respect the privacy and rights of others; refrain from
              unauthorized recordings. Commit to agreements, communicate timely,
              and use only approved payment methods on Fulfil. Behave
              professionally with other users, use real names, and abide by all
              applicable laws. Refrain from using Fulfil for illegal activities,
              like procuring alcohol or illegal substances. If representing an
              organization, you must have authority to commit that organization.
              Disclose any potential conflict of interest or if using Fulfil for
              investigative or unlawful purposes. Additional Responsibilities
              for Doers: Doers confirm: They function as a recognized business
              entity and have an independent clientele. They can legally work in
              their operating region and have necessary licenses or permits.
              They've procured required insurance and maintain a genuine profile
              on Fulfil. Their services are offered based on expertise and are
              executed safely and lawfully. 4. Billing and Payment Procedures on
              Fulfil User Agreements: Users on Fulfil deal directly with other
              users, i.e., "Doers" provide services for "Needers". While Fulfil
              facilitates the platform, it doesn't take part in the contracts.
              The Needer is entirely in charge of payments for tasks. Payment
              Mechanics: Payments for tasks, service charges, and any additional
              fees should be transacted through the PSP (third-party payment
              service provider). Needers must input their payment information to
              Fulfil and the PSP. Invoicing: Doers must send accurate invoices
              to their Needers within 24 hours post-task, capturing all costs
              including task payment, any agreed-upon out-of-pocket expenses,
              Fulfil service charges, any Trust & Support fee, or potential
              cancellation charges. Tips or gratuities can be added to the
              invoice, which go directly to the Doer. Needers could incur a 3%
              payment processing fee for transactions. Doers might also need to
              cover registration fees or return incorrect payments. PSP Account
              Set-Up: Doers need to set up a PSP account. This might involve
              registration, agreeing to PSP's terms, and potentially other
              verification steps. Doers should be familiar with the PSP's
              service agreement. Validation for Safety: To ensure security and
              prevent fraud, both Fulfil and the PSP might verify an account
              before its activation and before each booking. This can involve
              temporary charges which are then refunded. Automatic Payment
              Authorization: Once a task is confirmed complete, the Needer
              automatically allows the PSP to process the corresponding invoice.
              If a task is booked but then canceled by the Needer before it
              starts, they may be billed a one-hour cancellation fee.
              Discretionary Holds and Refunds: Fulfil can, in certain situations
              like potential fraud or at a user's request, place holds on
              payments or facilitate refunds via the PSP. Tax Implications:
              Users may be responsible for any relevant taxes on the tasks or
              fees under the agreement. In some areas, Fulfil might need to
              collect or report tax information about users and can provide
              necessary documentation for accurate tax reporting. 5. Community
              Features and Proper Conduct on the Fulfil Platform The Fulfil
              platform may feature user profiles, internal messaging systems,
              blogs, feedback boards, task listings, discussion forums, and
              various communication tools (herein referred to as “Community
              Features”) that facilitate interaction between Doers and Needers.
              It is imperative that these features be utilized in a manner that
              adheres to their intended purpose. For the security and integrity
              of the Fulfil platform, Needers and Doers are strictly advised
              against sharing personal contact information with other platform
              users. Prohibited Activities: Users of the Fulfil platform are
              expressly prohibited from: Engaging in, or promoting, conduct that
              is defamatory, abusive, harassing, or threatening, or otherwise
              violating the rights (including, but not limited to, privacy and
              intellectual property rights) of others, be it fellow users or
              Fulfil staff. Publishing, uploading, or disseminating any content
              that is profane, defamatory, unlawful, or infringing on others'
              rights. Uploading files that breach the intellectual property
              rights of any third party or potentially harm the Fulfil platform
              or its users' devices, such as malware or corrupted files.
              Advertising or promoting goods or services unrelated to the tasks
              or purposes for which the Fulfil platform was designed. Posting or
              fulfilling tasks that involve prohibited activities, including but
              not limited to, purchasing high-value items without prior
              authorization from Fulfil, engaging in illegal transportation
              services, or posting unauthorized reviews on third-party websites.
              Participating in unauthorized or deceptive activities, including
              impersonation, pyramid schemes, or spamming. Utilizing the Fulfil
              platform in a manner that violates local, state, or international
              law, or restricts or inhibits other users from enjoying the
              Community Features. Misrepresenting any association or endorsement
              by Fulfil or utilizing automated processes that interfere with the
              platform's normal operations. Uploading content that could be
              deemed harmful, engaging in unauthorized solicitation, or
              collecting personal information of users without explicit consent.
              Bypassing or attempting to bypass the payment system,
              misrepresenting invoice details, or registering on the platform
              with fraudulent or multiple identities. It is essential to note
              that all interactions within the Community Features are public.
              Users will be identifiable by their chosen username or profile.
              Fulfil assumes no responsibility for actions taken by users in
              response to content or interactions within these areas. 6. Account
              Deactivation, Suspension and Updates Fulfil retains the right to
              suspend your access to the platform while investigating potential
              violations of this Agreement on your part. Should it be determined
              that you've breached any term of this Agreement (referred to as a
              “User Violation”), Fulfil may choose to deactivate your account or
              limit its functionalities. We will provide you with a written
              notification of this decision, as mandated by law. However,
              exceptions might be made if there are reasons to suspect account
              compromise, or if issuing a notice might jeopardize safety or
              counteract our actions. Should you contest this decision, you are
              encouraged to reach out to policies@fulfil.com within 14 days of
              receiving the notice, detailing your reasons for appeal. If, under
              this Section, your account is suspended, deactivated, or its
              functionalities are limited, you are forbidden from establishing a
              new account in your name, or using any fictitious, borrowed, or
              another individual's name—even if you represent that third party.
              Regardless of whether your access to Fulfil is limited, suspended,
              or terminated, the terms of this Agreement will continue to bind
              you. Fulfil remains entitled to initiate legal proceedings in
              accordance with this Agreement. Fulfil reserves the absolute right
              to amend, halt, either temporarily or permanently, any part or all
              of the platform at our discretion. As required by law, we will
              keep you informed about such changes. Fulfil, to the fullest
              extent permissible by law, assumes no liability for any
              modification, suspension, or discontinuation of the platform or
              its services. Additionally, Fulfil may restrict any individual
              from completing the registration process if there are valid
              concerns about the platform's safety and integrity or other
              legitimate business apprehensions. If you wish to conclude this
              Agreement, you may do so at any time by discontinuing your use of
              Fulfil and deactivating your account. Upon installing our
              application, you grant permission for the app's installation and
              any subsequent updates or enhancements released via the Fulfil
              platform. The app, along with any updates or enhancements, may
              prompt your device to automatically connect with Fulfil's servers
              to ensure optimal app performance and to gather usage metrics. It
              may also influence app-related preferences or data on your device
              and collect personal details in line with our Privacy Policy. You
              retain the right to uninstall the application whenever you wish.
              7. Account Details, Security, and Telephonic Communications You
              must register to use the Fulfil platform. Safeguard your login
              credentials; you are responsible for all activities under your
              account. Alert Fulfil of any unauthorized access or security
              concerns. Communications to or from Fulfil may be recorded for
              quality and training. Ensure the accuracy of your contact details
              shared with Fulfil and its partners. If we detect inaccuracies,
              your account may be suspended or terminated. Update any changes to
              your contact details promptly. Providing a non-owned phone number
              is prohibited. Notify Fulfil of phone number ownership changes by
              sending 'STOP' to any prior number's text message. 8.
              User-Generated Content "User-Generated Content" (UGC) refers to
              materials you provide during your engagement with the Fulfil
              Platform and related campaigns. Responsibility for UGC rests with
              you, while Fulfil acts only as a distributor. Fulfil neither
              creates nor endorses UGC, and bears no liability for it. However,
              UGC not aligning with our terms may be removed. Your UGC must: Be
              truthful and precise. Avoid illegal activities or transactions.
              Uphold third-party rights, including privacy and intellectual
              property. Align with all relevant regulations. Avoid harmful,
              malicious, or deceptive content. Not falsely claim affiliation
              with Fulfil or its representatives. Not jeopardize Fulfil's
              operations or partner relationships. Fulfil hosts user feedback
              and reviews. These express individual user perspectives, not
              Fulfil’s. While we aren’t liable for such feedback, reports of
              violating content can be directed to our support. If rights
              infringement claims arise due to a user's UGC, Fulfil might
              identify the concerned user to the claiming parties for direct
              resolution. Should UGC appear objectionable or infringing,
              especially if promoting severe offenses, users can report it to
              Fulfil's designated contact. 9. External Websites The Fulfil
              Platform may feature links to third-party websites. These links
              are provided for informational purposes only and do not imply
              Fulfil's endorsement or affiliation. Fulfil is not responsible for
              the content, accuracy, or practices of these external sites. You
              should evaluate the content and trustworthiness of information
              from third-party websites. Fulfil has no obligation to monitor or
              modify these links but may remove or limit them at its discretion.
              Your interactions with third-party websites are governed by their
              respective terms and privacy policies. Engaging with these
              websites is at your own risk. Fulfil is not liable for any issues
              arising from your use of these external sites and you agree to
              indemnify Fulfil from any claims related to such sites. 10. Fulfil
              is an Online Service Marketplace Fulfil serves as a digital
              platform connecting Needers with independent Doers. Fulfil does
              not directly offer services nor does it employ individuals to
              perform tasks. These Doers function as independent business
              entities, determining their own work schedules, locations, and
              service terms. They operate under their own names or business
              names, not as representatives of Fulfil. Doers supply their own
              tools and can work for multiple clients or platforms, including
              competitors. While they choose the tasks they take on, they're
              expected to fulfill agreed-upon obligations with Needers. They
              also set their own pricing without interference from Fulfil.
              Fulfil is not an employment agency, and it does not act as an
              employer for any user. Doers understand that they make independent
              business decisions, which may result in profit or loss. 11.
              Intellectual Property and Copyright All content, such as text,
              graphics, designs, photos, videos, logos, and more, excluding User
              Generated Content addressed within this document, is owned by
              Fulfil (referred to as “Proprietary Material”). This material is
              protected under local and international intellectual property
              laws. Users are prohibited from copying or using any of the
              Proprietary Material from the Fulfil platform without explicit
              permission from Fulfil. Trademarks and logos associated with
              Fulfil are its exclusive property. Any other brand names or logos
              seen on the Fulfil platform belong to their respective owners.
              Unauthorized use of Fulfil's marks, logos, or any other
              proprietary content is strictly forbidden. Fulfil values
              intellectual property rights and expects its Users to do the same.
              If you believe any materials on the Fulfil platform infringe on
              your intellectual property rights, please contact us. Description
              of the copyrighted work you claim is infringed, including where on
              the Fulfil platform it's found. Ensure the information is
              sufficient for Fulfil to locate the material and clarify why you
              believe there's an infringement. Location of the original or
              authorized copy of the copyrighted work, e.g., its URL or book
              title. Your contact details: name, address, phone number, and
              email. A statement asserting that you believe in good faith that
              the disputed use isn't authorized by the copyright owner, its
              agent, or the law. A declaration, under penalty of perjury, that
              your provided information is accurate and that you are the
              copyright holder or have authorization to represent them. Your
              electronic or physical signature confirming the above information.
              12. Confidentiality You recognize that Confidential Data (defined
              below) is a unique asset of Fulfil. You commit not to disclose or
              misuse this data, other than for appropriate use on the Fulfil
              platform, for the duration of your account and 10 years
              thereafter. You may share this with authorized personnel, provided
              they uphold confidentiality. You'll protect the data from
              unauthorized exposure and promptly return any related documents to
              Fulfil upon account termination or agreement end. "Confidential
              Data" covers all of Fulfil's trade secrets, proprietary
              information, and other non-public details. This includes, but
              isn't limited to, technical insights, product strategies, customer
              details, software, processes, designs, marketing, finances, and
              information about Fulfil's operations and partners. 13. Disclaimer
              of Warranties A. User Responsibility The Fulfil Platform is
              offered "as is" without explicit or implied guarantees. Fulfil
              doesn't assure content accuracy and assumes no responsibility for
              issues such as inaccuracies, personal injury, property damage, or
              data breaches. Any third-party offerings on the Fulfil Platform
              aren't endorsed by Fulfil. Users must exercise caution and
              judgment. Fulfil doesn't guarantee uninterrupted service or the
              absence of tech issues like viruses. Each user is responsible for
              their interactions and transactions on Fulfil, and Fulfil provides
              no assurances about the capabilities or credentials of its users.
              B. Limitations of Liability By using the Fulfil Platform, users
              agree to limited liability terms. Users shouldn't hold Fulfil or
              its associates accountable for damages, losses, or disputes
              arising from platform usage. Fulfil and its partners won't be
              liable for any direct or indirect damages, including but not
              limited to financial losses, data losses, goodwill losses, and
              service interruptions. If, however, liability is established, any
              compensation won't exceed the fees you've paid to Fulfil in the
              past six months. Always be aware of the inherent risks associated
              with online transactions and act wisely. 14. Indemnification You
              agree to indemnify and defend Fulfil and its associates against
              any liabilities arising from: Your use or misuse of the Fulfil
              Platform. Your involvement in tasks, performance issues, or
              payment disputes. Breaches of this Agreement. Any legal violations
              or infringement of user or third-party rights. Misrepresentation
              as referenced in Section 2. Any content you submit that might
              violate intellectual or legal rights. Actions or negligence of any
              agents if you are a client. Fulfil retains the right to manage its
              own defense regarding such matters. You must not settle any claim
              without Fulfil's prior approval. 15. Dispute Resolution For any
              disputes arising from your use of Fulfil or related to this
              Agreement, you and Fulfil agree to negotiate informally for at
              least 30 days before considering further actions. Start
              negotiations with a written notice. Send your notices to the email
              in our contact info. 16. General Provisions Fulfil's failure to
              enforce any part of this Agreement shall not be seen as a waiver
              of any term or right. This Agreement is the complete understanding
              between you and Fulfil regarding its subject, superseding prior
              agreements. Other separate agreements, like specialized service
              terms, remain unaffected. Each term here is meant to be valid and
              enforceable. If any term is deemed invalid or unenforceable, it
              will be adjusted to become valid, or removed without affecting
              other terms. Fulfil can assign this Agreement without needing your
              approval, for reasons such as corporate restructuring or asset
              acquisition. You can't assign this Agreement without Fulfil's
              written consent. Any unauthorized assignment is void. This
              Agreement benefits and binds Fulfil and its successors. Terms
              meant to continue post-expiration or termination will do so. 17.
              Licensing Doers are responsible for securing required licenses or
              permits before providing services. Some services might be
              restricted or illegal, and it's on Doers to steer clear of these.
              Breaching these requirements may lead to penalties. Needers should
              verify if a Doer meets specific qualifications or licenses for
              certain tasks and communicate any unique challenges or hazards
              associated with the task. If unsure about legal regulations for a
              task, it's recommended to seek legal advice. 18. Changes to this
              Agreement and the Fulfil Platform Fulfil reserves the right, in
              its sole discretion, to modify, amend, add to, or remove portions
              of this Agreement (including Terms of Service, Privacy Policy, and
              any other accompanying policies) and to modify, suspend, or
              terminate the Fulfil Platform or its content at any time, either
              with or without prior notice, and without any liability to Fulfil.
              Limits on certain features might be imposed or access to parts or
              all of the Fulfil Platform could be restricted without prior
              notice or liability. While Fulfil will make efforts to inform you
              of significant amendments to this Agreement via email, there is no
              obligation and no liability arises for any missed notifications.
              If you disagree with any future modifications to this Agreement or
              if they render you non-compliant, you must deactivate your account
              and cease using the Fulfil Platform immediately. By continuing to
              use the Fulfil Platform after any changes to this Agreement, you
              fully and unconditionally accept all those changes, unless such
              acceptance is prohibited by local regulations or laws. 19. No
              Rights of Third Parties The terms of this Agreement are
              exclusively for the benefit of the involved Parties and their
              permitted successors and assigns. They should not be interpreted
              as granting any rights to any third party (including any potential
              rights for third party beneficiaries except as detailed in a
              relevant section) or to grant any individual or entity other than
              the Doer or Needer any privilege, remedy, claim, reimbursement,
              cause of action, or any other rights concerning any agreement or
              provision within or anticipated by this Agreement. Terms within
              this Agreement are not enforceable by individuals or entities who
              are not party to this Agreement. However, a Needer's
              representative may act on behalf of and represent their Needer.
              20. Consent to Receive Notices Electronically You give your
              consent to receive any agreements, notifications, disclosures, and
              other communications (collectively referred to as “Notices”)
              pertinent to this Agreement electronically, which may include but
              is not limited to receipt via email or by posting Notices on the
              Fulfil platform. You acknowledge and agree that all Notices that
              we deliver to you electronically meet any legal requirements that
              such communication be in written form. Unless stated differently
              in this Agreement, all Notices under this Agreement must be in
              writing and will be considered as duly given when received, if
              delivered personally or sent by certified or registered mail with
              return receipt requested; when the receipt is electronically
              confirmed if sent by facsimile or email; or the day it is shown as
              delivered based on the tracking information of a recognized
              overnight delivery service, if sent for next-day delivery.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseTOS}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
