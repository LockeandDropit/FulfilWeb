import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import LoggedOutHeader from "../../../components/Landing/LoggedOutHeader";
import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,

  Checkbox,
  Progress,
} from "@chakra-ui/react";
import Select from "react-select";
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
  arrayUnion,
  addCollection
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

import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { StreamChat } from "stream-chat";
import { useUserStore } from "../../Doer/Chat/lib/userStore";



const DoerAddProfileInfo = () => {
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [test, setTest] = useState(null);
  const [isEmployer, setIsEmployer] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [businessName, setBusinessName] = useState(null);

  const [isConvictedFelon, setIsConvictedFelon] = useState(false);
  const [isNonEnglishSpeaking, setIsNonEnglishSpeaking] = useState(false);

  const { fetchUserInfo } = useUserStore();

  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        console.log(currentUser.uid);
        if (currentUser.reloadUserInfo.displayName) {
          let nameArray = currentUser.reloadUserInfo.displayName.split(" ");
          console.log("name array", currentUser.reloadUserInfo);
          setFirstName(nameArray[0]);
          setLastName(nameArray[1]);
          setProfilePicture(currentUser.reloadUserInfo.photoUrl);
        }
      });
      setHasRun(true);
    } else {
    }
  }, []);
  const showID = () => {
    //  console.log(user.uid)
    console.log("this is the first name", firstName);
  };

  const navigate = useNavigate();

  const handleSendEmail = async () => {
    const response = await fetch(
      "https://emailapi-qi7k.onrender.com/sendDoerWelcomeEmail",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          firstName: firstName,
          lastName: lastName,
        }),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error);
  };

  // create new Chat User

  const createChatSlotInDB = async () => {
    const userChatsRef = collection(db, "User Messages");
    await setDoc(doc(userChatsRef, user.uid), {
      chats: arrayUnion({
        chatId: "placeholder",
      }),
    });
  };

  const [dateJoined, setDateJoined] = useState(null);

  useEffect(() => {
    //credit https://stackoverflow.com/questions/37271356/how-to-get-the-current-date-in-reactnative Irfan wani
    setDateJoined(new Date().toLocaleString());
  }, []);

  const handelSendNotSubscribedEmail = async () => {
    const response = await fetch(
      "https://emailapi-qi7k.onrender.com/sendDoerNotSubscribed",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
        }),
      }
    );

    const { data, error } = await response.json();
  };

  useEffect(() => {
    handelSendNotSubscribedEmail();
  }, []);

  const sendTylerEmail = () => {
    setDoc(doc(db, "Tyler Dashboard", user.uid), {
      firstName: firstName ? firstName : null,
      lastName: lastName ? lastName : null,
      isNeeder: false,
      isDoer: true,
      email: user.email,
      dateJoined: dateJoined,
    });
  };

  //creates My Resume in firestore
  const addResumeHolder = async () => {
      
     
      await setDoc(doc(db, "users", user.uid, "Resumes", "My Resume"), {
        education: [],
        experience: [],
        skills: [],
      }).then(() => {
        updateUserProfileFirestore();
      });
    };

  //yeah baby it WORKS. The below connects the user's auth ID with the firebase user document ID.. hopefully this helps in persistant auth and redux.

  //firestore help came from https://www.youtube.com/@NetNinja

  const updateUserProfileFirestore = () => {

  

    //submit data
    setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      businessName: businessName ? businessName : null,
      city: city,
      state: finalState,
      test: test,
      uid: user.uid,
      idStreamChat: user.uid,
      isPremium: false,
      isEmployer: false,
      email: user.email,
      streamChatID: user.uid,
      isOnboarded: false,
      emailVerified: false,
      userPreferredIndustry: null,
      resumeUploaded: false,
      stripeOnboarded: false, 
      savedCareerInterests: [],
      PrivacyPolicyAgree: privacyPolicy,
      ageAgreement: ageAgreement,
      termsOfService: termsOfService,
      taxAgreementConfirmed: taxAgreementConfirmed,
      profilePictureResponse: profilePicture ? profilePicture : null,
      isConvictedFelon: isConvictedFelon,
      isNonEnglishSpeaking: isNonEnglishSpeaking,
    });
    // IN USE
    createChatSlotInDB()
      .then(() => {
        fetchUserInfo(user.uid);
        console.log("data submitted, new chat profile created");
        navigate("/OnboardingFormHolder");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const [phoneValidationMessage, setPhoneValidationMessage] = useState();

  // big ty man regex https://www.sitepoint.com/using-regular-expressions-to-check-string-length/
  const minLengthRegEx = /^.{1,}$/;

  //cited elsewhere
  const checkLength = () => {
    const firstNameValid = minLengthRegEx.test(firstName);
    const lastNameValid = minLengthRegEx.test(lastName);
    const cityValid = minLengthRegEx.test(city);
    const stateValid = minLengthRegEx.test(state);

    const phoneNumberValid = phoneRegex.test(phoneNumber);

    if (
      !firstName ||
      !lastName ||
      !city ||
      !state ||
      privacyPolicy !== true ||
      ageAgreement !== true ||
      termsOfService !== true
    ) {
      onOpenIncomplete();
    } else if (phoneNumber ? !phoneNumberValid : null) {
      console.log("going through", phoneNumberValid);
      setPhoneValidationMessage("Phone number format invalid");
    } else {
      sendTylerEmail();
      //recent change, this was working.
      //old
      // updateUserProfileFirestore();

      //new
      addResumeHolder();
    }
  };

  const handleAgreeAll = () => {
    setTaxAgreementConfirmed(true);
    setTermsOfService(true);
    setPrivacyPolicy(true);
    //this is depreciated, only kept for now so I dont need to fiddle with all that other code
    setAgeAgreement(true);
  };

  //handle check agreements
  const [termsOfService, setTermsOfService] = useState(true);
  const [privacyPolicy, setPrivacyPolicy] = useState(true);
  const [ageAgreement, setAgeAgreement] = useState(true);
  const [taxAgreementConfirmed, setTaxAgreementConfirmed] = useState(null);

  // useEffect(() => {
  //   console.log(termsOfService, privacyPolicy, ageAgreement);
  // }, [termsOfService, privacyPolicy, ageAgreement]);

  //modal control
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenTOS,
    onOpen: onOpenTOS,
    onClose: onCloseTOS,
  } = useDisclosure();
  const {
    isOpen: isOpenIncomplete,
    onOpen: onOpenIncomplete,
    onClose: onCloseIncomplete,
  } = useDisclosure();

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  const stateOptions = [
    { label: "Alabama", id: 1 },
    { label: "Alaska", id: 2 },
    { label: "Arizona", id: 3 },
    { label: "Arkansas", id: 4 },
    { label: "California", id: 5 },
    { label: "Colorado", id: 6 },
    { label: "Connecticut", id: 7 },
    { label: "Delaware", id: 8 },
    { label: "Florida", id: 9 },
    { label: "Georgia", id: 10 },
    { label: "Hawaii", id: 11 },
    { label: "Idaho", id: 12 },
    { label: "Illinois", id: 13 },
    { label: "Indiana", id: 14 },
    { label: "Iowa", id: 15 },
    { label: "Kansas", id: 16 },
    { label: "Kentucky", id: 17 },
    { label: "Louisiana", id: 18 },
    { label: "Maine", id: 19 },
    { label: "Maryland", id: 20 },
    { label: "Massachusetts", id: 21 },
    { label: "Michigan", id: 22 },
    { label: "Minnesota", id: 23 },
    { label: "Mississippi", id: 24 },
    { label: "Missouri", id: 25 },
    { label: "Montana", id: 26 },
    { label: "Nebraska", id: 27 },
    { label: "Nevada", id: 28 },
    { label: "New Hampshire", id: 29 },
    { label: "New Jersey", id: 30 },
    { label: "New Mexico", id: 31 },
    { label: "New York", id: 32 },
    { label: "North Carolina", id: 33 },
    { label: "North Dakota", id: 34 },
    { label: "Ohio", id: 35 },
    { label: "Oklahoma", id: 36 },
    { label: "Oregon", id: 37 },
    { label: "Pennsylvania", id: 38 },
    { label: "Rhode Island", id: 39 },
    { label: "South Carolina", id: 40 },
    { label: "South Dakota", id: 41 },
    { label: "Tennessee", id: 42 },
    { label: "Texas", id: 43 },
    { label: "Utah", id: 44 },
    { label: "Vermont", id: 45 },
    { label: "Virginia", id: 46 },
    { label: "Washington", id: 47 },
    { label: "West Virginia", id: 48 },
    { label: "Wisconsin", id: 49 },
    { label: "Wyoming", id: 50 }
  ]
  
const [finalState, setFinalState] = useState(null)

useEffect(() => {
  if (state) {
    setFinalState(state.label)
  }
}, [state])

  return (
    <>
      <LoggedOutHeader />

      <Center>
        <div class="w-full p-4 sm:w-1/2 lg:w-1/3 sm:p-1 ">
          <form>
            <div className="space-y-12">
              <div className=" border-gray-900/10 pb-0">
                <h2 className="text-xl font-semibold leading-7 text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-base leading-6 text-gray-600">
                  {" "}
                  We just need a few pieces of information to get started
                </p>
                <form>
                  <div class="mt-6 grid gap-4 lg:gap-6">
                    <div class="grid grid-cols-1 gap-4 lg:gap-6">
                      <div>
                        <label
                          for="hs-firstname-hire-us-1"
                          class="block mb-2 text-sm text-gray-700 font-medium "
                        >
                          First Name
                        </label>
                        <input
                          onChange={(e) => setFirstName(e.target.value)}
                          type="text"
                          name="hs-firstname-hire-us-1"
                          id="hs-firstname-hire-us-1"
                          class="py-3 px-4 block w-full xl:w-1/2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        />
                      </div>
                      <div>
                        <label
                          for="hs-lastname-hire-us-1"
                          class="block mb-2 text-sm text-gray-700 font-medium "
                        >
                          Last Name
                        </label>
                        <input
                          onChange={(e) => setLastName(e.target.value)}
                          type="text"
                          name="hs-lastname-hire-us-1"
                          id="hs-lastname-hire-us-1"
                          class="py-3 px-4 block w-full xl:w-1/2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label
                          for="hs-company-hire-us-1"
                          class="block mb-2 text-sm text-gray-700 font-medium "
                        >
                          City
                        </label>
                        <input
                         onChange={(e) => setCity(e.target.value)}
                          type="text"
                          name="hs-company-hire-us-1"
                          id="hs-company-hire-us-1"
                          class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                        />
                      </div>
                      <div>
                        <label
                          for="hs-company-website-hire-us-1"
                          class="block mb-2 text-sm text-gray-700 font-medium "
                        >
                         State
                        </label>
                        <Select
          className="w-full mt-4 sm: mt-10"
          isClearable={isClearable}
          isSearchable={isSearchable}
          options={stateOptions}
          onSelect={(e) => setState(e.target.value)}
          onChange={setState}
        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center sm:justify-end gap-x-6">
              <input
                type="button"
                value="Continue"
                onClick={() => checkLength()}
                class="w-full sm:w-1/4 text-center justify-center mt-6 lg:mt-10 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
                data-hs-overlay="#"
              ></input>
            </div>
          </form>

        </div>
      </Center>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent height="66vh">
          <ModalHeader fontSize="16px">Privacy Policy</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="scroll">
            <Text marginTop="8">
              Last Updated: [10/30/24] FULFIL INC. PRIVACY POLICY This policy
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
              FULFIL. 1. Information Collection and Use When using the ChatGPT
              feature, user input may be processed by third-party services, such
              as OpenAI, to generate responses. Fulfil may collect and use this
              data for purposes of improving the ChatGPT service and enhancing
              user experience. By using the ChatGPT feature, you consent to the
              processing of your input data as outlined in this Privacy Policy.
              2. Third-Party Access To facilitate the ChatGPT feature, Fulfil
              may share anonymized data with third-party providers, such as
              OpenAI. This data sharing is strictly for operational purposes,
              and all data processed by third-party services is handled in
              accordance with Fulfil’s data protection policies. Users should
              review OpenAI’s Privacy Policy for further details on data
              handling practices. 3. Data Security and Retention Fulfil takes
              data privacy seriously and applies appropriate measures to protect
              user input data. Input data submitted through ChatGPT will be
              retained only as necessary to improve the service or as required
              by applicable laws. Users may contact us to request the deletion
              of data submitted through ChatGPT. 4. Age Restriction The ChatGPT
              feature is intended for use by individuals aged 16 and older. If
              you are under the age of 16, please refrain from using this
              feature. Fulfil does not knowingly collect or retain data from
              users under this age in connection with the ChatGPT feature.
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
              Fulfil Global Terms of Service Last updated 10/30/2024. These
              Terms of Service reprsesent a binding agreement between you and
              Fulfil, Inc. (“Fulfil”) concerning your use of the Fulfil
              Platform. The Fulfil Platform encompasses Fulfil's websites,
              mobile applications, and associated services and content. All
              personal data you provide to the Fulfil Platform, or that we
              gather, is subject to our Global Privacy Policy ("Privacy
              Policy"). By utilizing the Fulfil Platform, you confirm that
              you've reviewed our Privacy Policy. By acknowledging the Terms of
              Service and/or using the Fulfil platform, you expressly confirm
              that you have read, understand, and unconditionally agree to be
              bound by this Agreement and all of its terms. If you do not accept
              and agree to be bound by this Agreement, you must not use or
              access the Fulfil platform No agency, partnership, joint venture,
              employer-employee or franchiser-franchisee relationship is
              intended or created by this Agreement. The Fulfil Platform:
              Connecting Doers and Needers The Fulfil Platform is a digital
              marketplace linking Needers seeking services and Doers offering
              them. Both Needers and Doers are termed "Users". When both parties
              agree on a task. Doers' Independent Status: Doers are independent
              contractors, not affiliates or employees of Fulfil. Fulfil merely
              acts as a bridge, linking service seekers (Needers) with providers
              (Doers) and does not undertake any tasks itself. Disclaimer:
              Fulfil doesn't oversee, direct, or control a Doer's work and
              disclaims any responsibility for their performance, ensuring
              neither quality nor compliance with laws or regulations. No
              Endorsement of Doers: References to a Doer's credentials or
              descriptions only indicate they've met registration processes or
              criteria on our platform and have received ratings from other
              users. Such labels aren't endorsements or guarantees by Fulfil
              about the Doer's skills, qualifications, or trustworthiness.
              Needers must make their judgments about Doers' suitability. Fulfil
              does not directly endorse any Doer. Limitations: Fulfil isn't
              liable for any interactions, quality, legality, or outcomes of
              tasks, nor does it vouch for the integrity or qualifications of
              Users. Fulfil doesn't guarantee the accuracy, timeliness, or
              reliability of services requested or provided by Users. 2.
              Contract between Users When a Needer and a Doer agree on a task's
              terms, they enter into a binding contract (the “Service
              Agreement”). This agreement comprises the terms in this Section 2,
              the terms agreed upon on the Fulfil Platform, and other accepted
              contractual terms, as long as they don't conflict with this
              Agreement or limit Fulfil’s rights. Importantly, Fulfil isn't a
              party to this Service Agreement and never has an employment
              relationship with Doers because of it. Needers must pay Doers in
              full using the payment methods specified on the Fulfil Platform,
              based on the agreed rates in the Service Agreement. All Users
              should adhere to both the Service Agreement and this overarching
              Agreement during task engagement and completion. 3. Doer
              Background Checks & User Responsibilities Doer Background Checks:
              Doers may undergo reviews, possibly including identity
              verification and criminal background checks, termed “Background
              Checks”. While Fulfil conducts these checks, it cannot guarantee
              the complete authenticity of a user's identity or background. It’s
              always recommended to use caution and common sense for safety, as
              you would with strangers. Fulfil won't be responsible for
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
              overnight delivery service, if sent for next-day delivery. DMCA
              Notice and Takedown Procedure DMCA Compliance Fulfil respects the
              intellectual property rights of others and expects users to do the
              same. It is our policy to respond to clear notices of alleged
              copyright infringement that comply with the Digital Millennium
              Copyright Act (DMCA). Designated Agent If you believe that your
              work has been copied in a way that constitutes copyright
              infringement, please provide our Designated Copyright Agent with
              the following information: Identification of the copyrighted work
              that you claim has been infringed. Identification of the material
              that is claimed to be infringing and where it is located on the
              site. Your contact information, including your address, telephone
              number, and email address. A statement by you that you have a good
              faith belief that the disputed use is not authorized by the
              copyright owner, its agent, or the law. A statement by you, made
              under penalty of perjury, that the above information in your
              notice is accurate and that you are the copyright owner or
              authorized to act on the copyright owner’s behalf. Your physical
              or electronic signature. Please send your notice of claimed
              infringement to: Tyler Bradley DMCA Designated Agent Email:
              tyler@getfulfil.com Counter-Notice by Accused User If you receive
              a notice from us that material you have posted has been removed or
              access to it has been disabled and you believe this was done
              mistakenly or that you have the right to post the material, you
              may submit a counter-notice to our DMCA Designated Agent with the
              following information: Identification of the material that has
              been removed or to which access has been disabled and the location
              where the material appeared before it was removed or disabled. A
              statement, under penalty of perjury, that you have a good faith
              belief that the material was removed or disabled as a result of
              mistake or misidentification of the material. Your name, address,
              telephone number, and email address. A statement that you consent
              to the jurisdiction of the federal court in your district or, if
              your address is outside the United States, for any judicial
              district in which the service provider may be found, and that you
              will accept service of process from the person who provided the
              original notification or an agent of such person. Your physical or
              electronic signature. Upon receiving a valid counter-notice, we
              may restore the material in question. Repeat Infringer Policy
              Fulfil reserves the right to terminate users who are found to be
              repeat infringers. Modifications to Policy We reserve the right to
              amend this policy at any time by posting a revised version on our
              website. 1. Use of ChatGPT and Disclaimer of Accuracy The ChatGPT
              feature provided on the Fulfil website is designed to offer
              general information and guidance only. All responses generated by
              ChatGPT are based on AI algorithms and may not always reflect
              accurate, complete, or up-to-date information. Users are advised
              to verify the information before acting on it. Fulfil disclaims
              any responsibility for the accuracy, reliability, or suitability
              of responses provided by ChatGPT. 2. Limitation of Liability By
              using the ChatGPT feature on Fulfil, you acknowledge that any
              reliance on information provided by ChatGPT is at your own risk.
              Fulfil is not liable for any direct, indirect, incidental,
              consequential, or punitive damages arising from the use of
              ChatGPT, including any outcomes of employment decisions or job
              placements. Fulfil is not responsible for any advice, suggestions,
              or information provided by ChatGPT. 3. User Responsibility Users
              agree that they are solely responsible for evaluating and
              verifying any information or advice provided by ChatGPT. Fulfil
              does not endorse or guarantee the accuracy of any response and
              encourages users to seek additional information or professional
              advice before making decisions.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseTOS}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenIncomplete} onClose={onCloseIncomplete}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Form Incomplete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Please fill out all fields and agree to the statements at the
              bottom of the form before continuing.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseIncomplete}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DoerAddProfileInfo;
