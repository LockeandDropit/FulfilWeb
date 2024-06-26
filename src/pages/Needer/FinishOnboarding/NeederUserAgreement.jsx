import React, { useState, useEffect } from "react";
import NeederDashboard from "../NeederDashboard";
import NeederHeader from "../NeederHeader";

import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
  IconButton,
  CheckIcon,
  CloseIcon,
  EditIcon,
} from "@chakra-ui/react";
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
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";

import ImageUploading from "react-images-uploading";

import { useNavigate } from "react-router-dom";

const NeederUserAgreement = () => {
  const navigate = useNavigate();
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [user, setUser] = useState();

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);

        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);
  const agreeAndNavigate = () => {
    const docRef = doc(db, "employers", user.uid);

    updateDoc(doc(db, "employers", user.uid), {
      PrivacyPolicyAgree: true,
    });

   navigate("/NeederAccountManager");
  };
  return (
    <>
      <NeederHeader />

      <Flex>
        <NeederDashboard />

        <Box
          width="67vw"
          // alignContent="center"
          // justifyContent="center"
          // display="flex"
          // alignItems="baseline"
          borderWidth="2px"
          borderColor="#E3E3E3"
          borderLeftWidth="4px"
          borderRightWidth="4px"
          height="85vh"
          boxShadow="lg"
          rounded="lg"
          padding="8"
          overflowY="scroll"
        >
          <Center>
            <Heading size="lg" marginTop="16px" marginRight="45px">
              Privacy Policy
            </Heading>
          </Center>
          <Text marginTop="8">
            Last Updated: [07/28/23] FULFIL INC. PRIVACY POLICY This policy
            explains our information practices, defines your privacy options and
            describes how your information is collected and used. This policy
            covers the websites and the various mobile, web and desktop
            applications (collectively the “Applications”) made available by
            FULFIL Inc. (“FULFIL”). The FULFIL Website and the Applications are
            owned and operated by FULFIL, a company organized under the laws of
            Minnesota. Should you have privacy questions or concerns, send an
            email to fulfilhelp@gmail.com. By using or visiting the FULFIL
            Website or using the Applications, you agree to the collection and
            use of information in the manner described in this policy. If we
            make material changes to this policy, we will notify you by email,
            by means of a notice the next time you log in to the FULFIL Website,
            by means of a notice on the FULFIL Website homepage or when you next
            activate the Application. Such revisions and additions shall be
            effective immediately upon notice. You are responsible for reviewing
            the FULFIL Website or Applications periodically for any modification
            to this policy. Any access or use of the FULFIL Website or
            Applications by you after notice of modifications to this policy
            shall constitute and be deemed to be your agreement to such
            modifications. THE INFORMATION WE COLLECT This policy applies to all
            information collected on the FULFIL Website, any information you
            provide to FULFIL and any information that results from your use of
            Applications. You will most likely provide us personal information
            to us when you register as a user of FULFIL Website, license and
            then use the Applications or participate in certain FULFIL
            promotions or events. The personal information we may collect might
            include passwords, user names, addresses, email addresses, phone
            numbers, bank information and credit/debit card numbers. THE
            APPLICATIONS Use of the Applications is subject to the terms and
            conditions of the Application Terms of Use. BLOGS AND PRODUCT
            REVIEWS The FULFIL Website or Applications may include blogs,
            product reviews or other message areas that allow users to post or
            send information to the FULFIL Website or the Applications. When you
            post information to the FULFIL Website or Applications, others can
            also view that information. We urge you to exercise caution when
            providing personally identifiable information to FULFIL, FULFIL
            Website or the Applications. OUR COLLECTION OF YOUR DATA In addition
            to the personal information you supply, we may collect certain
            information to (1) evaluate how visitors, guests, and customers use
            the FULFIL Website or the Applications; or (2) provide you with
            personalized information or offers. We collect data to make the
            FULFIL Website and Applications work better for you in the following
            ways: to improve the design of the FULFIL Website and Applications,
            to provide personalization on the FULFIL Website and Applications
            and to evaluate the performance of our marketing programs. The
            technologies we may use to gather this non- personal information may
            include “IP” addresses, “cookies”, browser detection, “weblogs” and
            various “geo-location” tools. HOW WE COLLECT AND USE INFORMATION Our
            primary goal in collecting your information is to provide you with a
            personalized, relevant, and positive experience with the FULFIL
            Website and Applications. You can register on the FULFIL Website or
            the Applications to receive Promotions and updates, or to be
            contacted for market research purposes. You can control your privacy
            preferences regarding such marketing communications (see the section
            below entitled “Your Privacy Preferences”). From time to time, you
            may be invited to participate in optional customer surveys or
            promotions, and FULFIL may request that you provide some or all the
            above listed personal information in those surveys or promotions. We
            use information collected from surveys and promotions to learn about
            our customers to improve our services and develop new products and
            services of interest to our customers. IP addresses define the
            Internet location of computers and help us better understand the
            geographic distribution of our visitors and customers and manage the
            performance of the FULFIL Website. Cookies are tiny files placed
            onto the hard drive of your computer when you visit the FULFIL
            Website, so we can immediately recognize you when you return to the
            FULFIL Website and deliver content specific to your interests. You
            may modify your browser preferences to accept all cookies, be
            notified when a cookie is set, or reject all cookies. Please consult
            your browser instructions for information on how to modify your
            choices about cookies. If you modify your browser preferences,
            certain features of the FULFIL Website may not be available to you.
            We may detect the type of web browser you are using to optimize the
            performance of the FULFIL Website and to understand the mix of
            browsers used by our visitors, guests, and customers. To learn about
            how people use our site, we examine weblogs, which show the paths
            people take through the FULFIL Website and how long they spend in
            certain areas. The Applications may include the ability to link
            certain geographical information made available by us with your
            physical location. When you use the Applications, the Applications
            may know, in very general terms, your current physical location. To
            the extent that your physical location can be determined by the
            Applications, we may use your location to make available information
            to you that is relevant because of your physical location. We may
            also compile certain general information related to your use of the
            FULFIL Website and Applications. You agree that we are authorized to
            use, reproduce and generally make such information available to
            third parties in the aggregate, provided that your information shall
            not include personally identifiable information about you or be
            attributable to you. FULFIL may contract with unaffiliated third
            parties to provide services such as customer communications, website
            hosting, data storage, analytics and other services. When we do
            this, we may provide your personally identifiable information to
            third parties only to provide those services, and they are not
            authorized to use your personally identifiable information for any
            other purpose. OUR COMMITMENT TO DATA SECURITY Access to your
            personal data is limited to authorized FULFIL staff or approved
            vendors. Although total security does not exist on the Internet or
            through mobile networks, FULFIL shall make commercially reasonable
            efforts to safeguard the information that you submit to FULFIL. USE
            OF THE FULFIL WEBSITE AND APPLICATIONS BY CHILDREN THE FULFIL
            WEBSITE AND THE APPLICATIONS ARE NOT INTENDED FOR USE BY CHILDREN
            UNDER THE AGE OF 13. YOUR PRIVACY PREFERENCES When you sign up as a
            registered user of the FULFIL Website or Applications you may begin
            receiving marketing communications such as e-mail newsletters,
            product and service updates and promotions. Our customers generally
            find this type of information useful. If you do not want to receive
            these updates, you must “opt-out” by unchecking the “Add me to the
            mailing list” box on the registration page, or should you choose to
            opt-out after registering, you can select the “unsubscribe” link at
            the bottom of the email and follow the opt-out instructions or send
            an email to privacy@[URL].com/unsubscribe. HOW TO ACCESS, REVIEW,
            CORRECT OR DELETE YOUR INFORMATION Send FULFIL an email at
            privacy@[URL].com if you want to access, review, correct or delete
            your personally identifiable information collected by FULFIL. To
            protect your privacy and security, FULFIL requires a user ID and
            password to verify your identity before granting you the right to
            access, review or make corrections to your personally identifiable
            information. FULFIL may be required by law to retain certain of your
            personal information; if this is the case, you may not be able to
            correct or delete all your personal information. DISCLOSURE OF
            INFORMATION We reserve the right to disclose your personally
            identifiable information as required by law and when we believe that
            disclosure is necessary to protect our rights and/or comply with a
            judicial proceeding, court order or legal process. It is also
            possible that FULFIL would sell its business (by merger,
            acquisition, reorganization or otherwise) or sell all or
            substantially all its assets. In any transaction of this kind,
            customer information, including your personally identifiable
            information, may be among the assets that are transferred. If we
            decide to so transfer your personally identifiable information, you
            will be notified by an email sent to the last know email address in
            our files, by notice posted on the FULFIL Website or when you
            activate the Applications. PRIVACY AND OTHER WEBSITES AND
            APPLICATIONS The FULFIL Website or the Applications may contain
            links to other websites or other mobile applications. FULFIL is not
            responsible for the privacy practices of these other sites or
            applications. This policy only applies to information collected by
            FULFIL.
          </Text>
          <Center marginTop="16px">
          <Button colorScheme="blue" width="240px" onClick={() => agreeAndNavigate()}>I Agree</Button>
          </Center>
        </Box>


      </Flex>
    </>
  );
};

export default NeederUserAgreement;
