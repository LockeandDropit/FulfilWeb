import React, { useState, useEffect, useCallback } from "react";
import DoerHeader from "./DoerHeader";
import DoerDashboard from "./DoerDashboard";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import useEmblaCarousel from "embla-carousel-react";
import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Image,
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
  Select,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  deleteDoc,
  setDoc,
  col,
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
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import ImageUploading from "react-images-uploading";

import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";
import { useMediaQuery } from "@chakra-ui/react";
import { useChatContext } from "stream-chat-react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import test from "./test.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const UserProfile = () => {
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  const starImgFilled =
    "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
  const starImgCorner =
    "https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true";

  const [user, setUser] = useState();

  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);
  const [hasUploadedProfilePicture, setHasUploadedProfilePicture] =
    useState(false);

  const { client } = useChatContext();

  useEffect(() => {
    if (client) {
    } else {
    }
  }, [client]);

  // const getProfilePicture = async () => {
  //   const storage = getStorage();
  //   const reference = ref(storage, "users/" + user.uid + "/profilePicture.jpg");

  // };

  //redux store
  // const firstName = useSelector(selectUserFirstName);
  // const lastName = useSelector(selectUserLastName);
  // const bio = useSelector(selectUserBio);
  // const state = useSelector(selectUserState);
  // const experience = useSelector(selectUserExperience);
  // const skills = useSelector(selectUserSkills);

  //for test only

  //firestore

  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userBio, setUserBio] = useState(null);
  const [userState, setUserState] = useState();
  const [userExperience, setUserExperience] = useState(null);
  const [userSkills, setUserSkills] = useState(null);
  const [userCity, setUserCity] = useState();
  const [individualReviews, setIndividualReviews] = useState(null);
  const [] = useState();
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [isPremium, setIsPremium] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [email, setEmail] = useState(null);
  const [projectPictureOne, setProjectPictureOne] = useState(null);
  const [projectPictureTwo, setProjectPictureTwo] = useState(null);
  const [projectPictureThree, setProjectPictureThree] = useState(null);
  const [projectPictureFour, setProjectPictureFour] = useState(null);
  const [projectPictureFive, setProjectPictureFive] = useState(null);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        setUserInfo(snapshot.data());
        setEmail(snapshot.data().email);
        setIsPremium(snapshot.data().isPremium);
        setProfilePicture(snapshot.data().profilePictureResponse);
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        // setUserBio(snapshot.data().bio);

        setUserState(snapshot.data().state);

        setUserCity(snapshot.data().city);
        if (snapshot.data().projectPictureOne) {
          setProjectPictureOne(snapshot.data().projectPictureOne);
        }
        if (snapshot.data().projectPictureTwo) {
          setProjectPictureTwo(snapshot.data().projectPictureTwo);
        }
        if (snapshot.data().projectPictureThree) {
          setProjectPictureThree(snapshot.data().projectPictureThree);
        }
        if (snapshot.data().projectPictureFour) {
          setProjectPictureFour(snapshot.data().projectPictureFour);
        }
        if (snapshot.data().projectPictureFive) {
          setProjectPictureFive(snapshot.data().projectPictureFive);
        }

        if (snapshot.data().businessName) {
          setBusinessName(snapshot.data().businessName);
        }

        if (snapshot.data().premiumCategoryOne) {
          setPremiumCategoryOne(snapshot.data().premiumCategoryOne);
          setInitialPremiumCategoryOne(snapshot.data().premiumCategoryOne);
        }
        if (snapshot.data().premiumCategoryTwo) {
          setPremiumCategoryTwo(snapshot.data().premiumCategoryTwo);
          setInitialPremiumCategoryTwo(snapshot.data().premiumCategoryTwo);
        }
        if (snapshot.data().premiumCategoryThree) {
          setPremiumCategoryThree(snapshot.data().premiumCategoryThree);
          setInitialPremiumCategoryThree(snapshot.data().premiumCategoryThree);
        }
        if (snapshot.data().premiumCategoryFour) {
          setPremiumCategoryFour(snapshot.data().premiumCategoryFour);
          setInitialPremiumCategoryFour(snapshot.data().premiumCategoryFour);
        }
        if (snapshot.data().premiumCategoryFive) {
          setPremiumCategoryFive(snapshot.data().premiumCategoryFive);
          setInitialPremiumCategoryFive(snapshot.data().premiumCategoryFive);
        }
      });
    } else {
    }
  }, [user]);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        setUserBio(snapshot.data().bio);
        if (snapshot.data().resume) {
          setResume(snapshot.data().resume);
        }
      });
    } else {
    }
  }, [user]);

  const [userExperienceLength, setUserExperienceLength] = useState(0);
  const [userSkillsLength, setUserSkillsLength] = useState(0);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const skillsQuery = query(
        collection(db, "users", user.uid, "User Profile Skills")
      );
      const experienceQuery = query(
        collection(db, "users", user.uid, "User Profile Experience")
      );

      onSnapshot(skillsQuery, (snapshot) => {
        let skills = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          skills.push({ ...doc.data(), id: doc.id });
        });

        setUserSkills(skills);

        if (!skills || !skills.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setUserSkills(null);
          setUserSkillsLength(0);
        } else {
          setUserSkills(skills);
          setUserSkillsLength(skills.length);
        }
      });

      onSnapshot(experienceQuery, (snapshot) => {
        let experience = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          experience.push({ ...doc.data(), id: doc.id });
        });

        // setUserExperience(experience);
        if (!experience || !experience.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setUserExperience(null);
          setUserExperienceLength(0);
        } else {
          setUserExperience(experience);
          setUserExperienceLength(experience.length);
        }
      });
    } else {
    }
  }, [user]);

  //pulls cumulative reviews
  const [numberOfRatings, setNumberOfRatings] = useState(null);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "Ratings"));

      onSnapshot(q, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          if (isNaN(doc.data().rating)) {
          } else {
            ratingResults.push(doc.data().rating);
          }
        });
        //cited elsewhere
        if (!ratingResults || !ratingResults.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setRating(0);
        } else {
          setRating(
            ratingResults.reduce((a, b) => a + b) / ratingResults.length
          );
          setNumberOfRatings(ratingResults.length);
        }
      });
    } else {
    }
  }, [user]);

  // The following proivides the editable UI

  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <Button
          backgroundColor="#01A2E8"
          textColor="white"
          width="320px"
          marginTop="8px"
          {...getSubmitButtonProps()}
        >
          {" "}
          Finish Editing
        </Button>

        <IconButton
          icon={<Button>Cancel</Button>}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          size="sm"
          icon={
            <Button
              backgroundColor="white"
              textColor="#01A2E8"
              width="120px"
              marginTop="8px"
            >
              Edit
            </Button>
          }
          {...getEditButtonProps()}
        />
      </Flex>
    );
  }

  // modal stuff

  //varying modal control credit Prem G and Alireza Khanamani https://stackoverflow.com/questions/65988633/chakra-ui-using-multiple-models-in-a-single-component
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenProject,
    onOpen: onOpenProject,
    onClose: onCloseProject,
  } = useDisclosure();
  const {
    isOpen: isOpenAvatar,
    onOpen: onOpenAvatar,
    onClose: onCloseAvatar,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const {
    isOpen: isOpenBio,
    onOpen: onOpenBio,
    onClose: onCloseBio,
  } = useDisclosure();
  const {
    isOpen: isOpenCategories,
    onOpen: onOpenCategories,
    onClose: onCloseCategories,
  } = useDisclosure();
  const {
    isOpen: isOpenAddExperience,
    onOpen: onOpenAddExperience,
    onClose: onCloseAddExperience,
  } = useDisclosure();
  const {
    isOpen: isOpenAddQualification,
    onOpen: onOpenAddQualification,
    onClose: onCloseAddQualification,
  } = useDisclosure();
  const {
    isOpen: isOpenResume,
    onOpen: onOpenResume,
    onClose: onCloseResume,
  } = useDisclosure();
  
  //firebase submission after edit

  // const handleAddQualificationOpen = () => {
  //   if (userExperienceLength > 2) {
  //     alert(
  //       "Can't have more than 3 listed experiences. Either edit or delete a prior listed experience."
  //     );
  //   } else {
  //     onOpenAddExperience();
  //   }
  // };

  const handleAddExperienceOpen = () => {
    if (userExperienceLength > 2) {
      alert(
        "Can't have more than 3 listed experiences. Either edit or delete a prior listed experience."
      );
    } else {
      onOpenAddExperience();
    }
  };

  const updateUserProfileFirestore = () => {
    //check if null

    //submit data
    updateDoc(doc(db, "users", user.uid), {
      bio: updatedBio,
    })
      .then(() => {
        //all good

        setUserBio(updatedBio);
      })
      .catch((error) => {
        // no bueno
      });

    onCloseBio();
  };

  const [premiumCategoryOne, setPremiumCategoryOne] = useState(null);
  const [premiumCategoryTwo, setPremiumCategoryTwo] = useState(null);
  const [premiumCategoryThree, setPremiumCategoryThree] = useState(null);
  const [premiumCategoryFour, setPremiumCategoryFour] = useState(null);
  const [premiumCategoryFive, setPremiumCategoryFive] = useState(null);

  //this state is held to track changes between old and new categories to delete old ones in the database.

  const [initialPremiumCategoryOne, setInitialPremiumCategoryOne] =
    useState(null);
  const [initialPremiumCategoryTwo, setInitialPremiumCategoryTwo] =
    useState(null);
  const [initialPremiumCategoryThree, setInitialPremiumCategoryThree] =
    useState(null);
  const [initialPremiumCategoryFour, setInitialPremiumCategoryFour] =
    useState(null);
  const [initialPremiumCategoryFive, setInitialPremiumCategoryFive] =
    useState(null);

  const [isUploaded, setIsUploaded] = useState(false);

  const handleAllFBCategoryChange = () => {
    handlePremiumCategoryUpload();
    handleGlobalCategoryUpload();

    handleGlobalCategoryRemoval();
  };

  const handlePremiumCategoryUpload = () => {
    console.log(premiumCategoryOne, premiumCategoryTwo, premiumCategoryThree);

    updateDoc(doc(db, "users", user.uid), {
      premiumCategoryOne: premiumCategoryOne ? premiumCategoryOne : null,
      premiumCategoryTwo: premiumCategoryTwo ? premiumCategoryTwo : null,
      premiumCategoryThree: premiumCategoryThree ? premiumCategoryThree : null,
      premiumCategoryFour: premiumCategoryFour ? premiumCategoryFour : null,
      premiumCategoryFive: premiumCategoryFive ? premiumCategoryFive : null,
    })
      .then(() => {
        //all good

        setIsUploaded(true);
        setPremiumCategoryOne(premiumCategoryOne);
        setPremiumCategoryTwo(premiumCategoryTwo);
        // setPremiumCategoryThree(premiumCategoryOne);
        setPremiumCategoryThree(premiumCategoryThree);
        setPremiumCategoryFour(premiumCategoryFour);
        setPremiumCategoryFive(premiumCategoryFive);
      })
      .catch((error) => {
        // no bueno
      });
  };

  //need to add user id to selected category, tier one

  const handleGlobalCategoryUpload = () => {
    if (premiumCategoryOne) {
      setDoc(doc(db, "categories", premiumCategoryOne, "Tier 1", user.uid), {
        placeholder: "placeholder",
      })
        .then(() => {
          //all good
          setIsUploaded(true);
        })
        .catch((error) => {
          // no bueno
        });
    }

    if (premiumCategoryTwo) {
      setDoc(doc(db, "categories", premiumCategoryTwo, "Tier 1", user.uid), {
        placeholder: "placeholder",
      })
        .then(() => {
          //all good
          setIsUploaded(true);
        })
        .catch((error) => {
          // no bueno
        });
    }

    if (premiumCategoryThree) {
      setDoc(doc(db, "categories", premiumCategoryThree, "Tier 1", user.uid), {
        placeholder: "placeholder",
      })
        .then(() => {
          //all good
          setIsUploaded(true);
        })
        .catch((error) => {
          // no bueno
        });
    }
    if (premiumCategoryFour) {
      setDoc(doc(db, "categories", premiumCategoryFour, "Tier 1", user.uid), {
        placeholder: "placeholder",
      })
        .then(() => {
          //all good
          setIsUploaded(true);
        })
        .catch((error) => {
          // no bueno
        });
    }
    if (premiumCategoryFive) {
      setDoc(doc(db, "categories", premiumCategoryFive, "Tier 1", user.uid), {
        placeholder: "placeholder",
      })
        .then(() => {
          //all good
          setIsUploaded(true);
        })
        .catch((error) => {
          // no bueno
        });
    }
  };

  const handleGlobalCategoryRemoval = () => {
    // [x] on page load set premium categories already being used by the user.
    // [] check to see if the initial values are different than the new values

    let initialValues = [
      initialPremiumCategoryOne,
      initialPremiumCategoryTwo,
      initialPremiumCategoryThree,
      initialPremiumCategoryFour,
      initialPremiumCategoryFive,
    ];
    let newValues = [
      premiumCategoryOne,
      premiumCategoryTwo,
      premiumCategoryThree,
      premiumCategoryFour,
      premiumCategoryFive,
    ];

    //credit zcoop98 & Luis Sieira https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
    let difference = initialValues.filter((x) => !newValues.includes(x));

    //if so, delete onl value in fb
    if (difference) {
      difference.forEach((category) => {
        deleteDoc(doc(db, "categories", category, "Tier 1", user.uid));
      });
    }
  };
  //need to remove from unselected or changed category, if applicable
  //

  const handleCloseCategories = () => {
    onCloseCategories();
    setIsUploaded(false);
  };

  const [experienceTitle, setExperienceTitle1] = useState(null);
  const [experienceDescription, setExperienceDescription] = useState(null);
  const [experienceYears, setExperienceYears] = useState(null);

  const [addExperienceTitle, setAddExperienceTitle] = useState(null);
  const [addExperienceDescription, setAddExperienceDescription] =
    useState(null);
  const [addExperienceYears, setAddExperienceYears] = useState(null);

  const updateUserExperience = (userExperience) => {
    //submit data and update bio

    updateDoc(
      doc(db, "users", user.uid, "User Profile Experience", userExperience.id),
      {
        Title: experienceTitle ? experienceTitle : userExperience.Title,

        Description: experienceDescription
          ? experienceDescription
          : userExperience.Description,

        Years: experienceYears ? experienceYears : userExperience.Years,
      }
    )
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
      });

    setExperienceTitle1(null);
    setExperienceDescription(null);
    setExperienceYears(null);

    onClose();
  };

  //check how many experiences listed in FB

  const addNewUserExperience = () => {
    if (userExperienceLength === 0 || null) {
      setDoc(
        doc(
          db,
          "users",
          user.uid,
          "User Profile Experience",
          addExperienceTitle
        ),
        {
          Title: addExperienceTitle,
          Description: addExperienceDescription,
          Years: addExperienceYears,
        }
      )
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
      onCloseAddExperience();
    } else if (userExperienceLength === 1) {
      setDoc(
        doc(
          db,
          "users",
          user.uid,
          "User Profile Experience",
          addExperienceTitle
        ),
        {
          Title: addExperienceTitle,
          Description: addExperienceDescription,
          Years: addExperienceYears,
        }
      )
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
      onCloseAddExperience();
    } else if (userExperienceLength === 2) {
      setDoc(
        doc(
          db,
          "users",
          user.uid,
          "User Profile Experience",
          addExperienceTitle
        ),
        {
          Title: addExperienceTitle,
          Description: addExperienceDescription,
          Years: addExperienceYears,
        }
      )
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
      onCloseAddExperience();
    } else {
      alert(
        "You can not add more than 3! Consider editing one of your prior experiences"
      );
    }

    onCloseAddExperience();
  };

  const handleDeleteExperience = (experienceTitle) => {
    deleteDoc(
      doc(db, "users", user.uid, "User Profile Experience", experienceTitle),
      {}
    )
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
      });

    onClose();
  };

  const handleDeleteQualification = (qualificationTitle) => {
    console.log(qualificationTitle);
    deleteDoc(
      doc(db, "users", user.uid, "User Profile Skills", qualificationTitle),
      {}
    )
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
      });

    onClose2();
  };

  const [skillTitle1, setSkillTitle1] = useState();
  const [skillDescription, setSkillDescription] = useState();

  const handleAddQualificationOpen = () => {
    if (userSkillsLength > 2) {
      alert(
        "You can only have 3 qualifications. Edit one of your other qualifications"
      );
    } else {
      onOpenAddQualification();
    }
  };

  const updateUserQualification = (props) => {
    //submit data and update bio
    console.log("props", props.Title);
    updateDoc(doc(db, "users", user.uid, "User Profile Skills", props.id), {
      Title: skillTitle1 ? skillTitle1 : props.Title,
      Description: skillDescription ? skillDescription : props.Description,
    })
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
      });

    setSkillTitle1(null);
    setSkillDescription(null);

    onClose2();
  };

  const addNewUserQualification = () => {
    if (userSkillsLength === 0 || null) {
      setDoc(doc(db, "users", user.uid, "User Profile Skills", skillTitle1), {
        Title: skillTitle1,
        Description: skillDescription,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
      onCloseAddQualification();
    } else if (userSkillsLength === 1) {
      setDoc(doc(db, "users", user.uid, "User Profile Skills", skillTitle1), {
        Title: skillTitle1,
        Description: skillDescription,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
      onCloseAddQualification();
    } else if (userSkillsLength === 2) {
      setDoc(doc(db, "users", user.uid, "User Profile Skills", skillTitle1), {
        Title: skillTitle1,
        Description: skillDescription,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
      onCloseAddQualification();
    } else {
      alert(
        "You can not add more than 3! Consider editing one of your prior experiences"
      );
    }

    onCloseAddQualification();
  };

  //this set is for handling edit qualification modal

  const [openEditQualificationModalID, setOpenEditQualificaionModalID] =
    useState(null);

  const handleOpenEditQualificaionModal = (x) => {
    setOpenEditQualificaionModalID(x);
    onOpen2(x);
  };

  //this set id for experience

  const [openModalID, setOpenModalID] = useState(null);

  const handleOpenEditExperienceModal = (x) => {
    setOpenModalID(x);
    onOpen(x);
  };

  //alert handling

  //avatar image handling

  const [images, setImages] = React.useState(null);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit

    setImages(imageList);
    setProfilePicture(imageList[0].data_url);
  };

  //resume handling
  const [newResume, setNewResume] = useState(null);
  const [resume, setResume] = useState(null);

  // useEffect(() => {
  //   if (newResume) {
  //     uploadResumeToFirebase()
  //   }
  // }, [newResume])

  const uploadResumeToFirebase = async (x) => {
    const storage = getStorage();
    const resumeRef = ref(storage, "users/" + user.uid + "/resume.pdf");
    console.log("resume", x);

    // const img = await fetch(newResume);

    // console.log("resume img",img)

    // const file = await x.blob();
    const file = x;

    //   const metadata = {
    //     contentType: "image/jpeg",
    // };

    await uploadBytes(resumeRef, file).then((snapshot) => {});

    await getDownloadURL(resumeRef).then((response) => {
      updateDoc(doc(db, "users", user.uid), {
        resume: response,
        resumeUploaded: true
      })
        .then(() => {
          setResume(response);
        })
        .catch((error) => {
          // no bueno
        });
    });
  };

  //   const testPDFtype = async () => {
  //     const storage = getStorage();
  //     const resumeRef = ref(storage, "users/" + user.uid + "/construction-worker-resume.pdf");
  // console.log("resume", newResume)
  //     const img = await fetch(newResume);
  //     console.log("resume img",img)
  //     const bytes = await img.blob();

  //     await getDownloadURL(resumeRef).then((response) => {
  //       updateDoc(doc(db, "users", user.uid), {
  //         resume: response,
  //       })
  //         .then(() => {
  //           //all good
  //         })
  //         .catch((error) => {
  //           // no bueno
  //         });
  //       })
  //   }

  useEffect(() => {
    if (user) {
      getResume();
      // testPDFtype()
    } else {
    }
  }, [user]);

  const getResume = async () => {
    //     const storage = getStorage();
    //       const reference = ref(storage, "users/" + user.uid + "/resume.pdf");
    // console.log(reference)
    //       setResume(reference)
    getDoc(doc(db, "users", user.uid)).then((snapshot) => {
      if (!snapshot.data().resume) {
      } else {
        setResume(snapshot.data().resume);
        console.log("resume", snapshot.data().resume);
      }
    });
  };

  // useEffect(  () => {
  //   if (resume) {
  //     async function fetchData() {
  //     const url = resume;
  //     try {
  //       const response = await fetch(url);
  //       if (!response.ok) {
  //         throw new Error(`Response status: ${response.status}`);
  //       }

  //       const json = await response.json();
  //       console.log("json resopnse",json);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   }

  //   fetchData()
  // }
  // }, [resume])

  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess() {
    setNumPages(numPages);
  }

  const viewResume = () => {
    onOpenResume();
  };

  //project image handling

  const [projectImages, setProjectImages] = React.useState(null);
  const [newProjectImage, setNewProjectImage] = React.useState(null);
  const maxProjectNumber = 5;
  const onChangeProject = (imageList, addUpdateIndex) => {
    // data for submit

    setProjectImages(imageList);
    setNewProjectImage(imageList[0].data_url);
  };

  const uploadProjectsToFirebase = async () => {
    const storage = getStorage();
    const pictureRefOne = ref(storage, "users/" + user.uid + "/projectOne.jpg");
    const pictureRefTwo = ref(storage, "users/" + user.uid + "/projectTwo.jpg");
    const pictureRefThree = ref(
      storage,
      "users/" + user.uid + "/projectThree.jpg"
    );
    const pictureRefFour = ref(
      storage,
      "users/" + user.uid + "/projectFour.jpg"
    );
    const pictureRefFive = ref(
      storage,
      "users/" + user.uid + "/projectFive.jpg"
    );

    // setImage(result.assets[0].uri);
    // dispatch(selectUserProfilePicture(result.assets[0].uri))

    const img = await fetch(projectImages[0].data_url);
    const bytes = await img.blob();

    if (projectPictureOne === null) {
      await uploadBytes(pictureRefOne, bytes).then((snapshot) => {});

      await getDownloadURL(pictureRefOne).then((response) => {
        updateDoc(doc(db, "users", user.uid), {
          projectPictureOne: response,
        })
          .then(() => {
            //all good
          })
          .catch((error) => {
            // no bueno
          });
      });
    } else if (projectPictureTwo === null) {
      await uploadBytes(pictureRefTwo, bytes).then((snapshot) => {});

      await getDownloadURL(pictureRefTwo).then((response) => {
        updateDoc(doc(db, "users", user.uid), {
          projectPictureTwo: response,
        })
          .then(() => {
            //all good
          })
          .catch((error) => {
            // no bueno
          });
      });
    } else if (projectPictureThree === null) {
      await uploadBytes(pictureRefThree, bytes).then((snapshot) => {});

      await getDownloadURL(pictureRefThree).then((response) => {
        updateDoc(doc(db, "users", user.uid), {
          projectPictureThree: response,
        })
          .then(() => {
            //all good
          })
          .catch((error) => {
            // no bueno
          });
      });
    } else if (projectPictureFour === null) {
      await uploadBytes(pictureRefFour, bytes).then((snapshot) => {});

      await getDownloadURL(pictureRefFour).then((response) => {
        updateDoc(doc(db, "users", user.uid), {
          projectPictureFour: response,
        })
          .then(() => {
            //all good
          })
          .catch((error) => {
            // no bueno
          });
      });
    } else {
      await uploadBytes(pictureRefFive, bytes).then((snapshot) => {});

      await getDownloadURL(pictureRefFive).then((response) => {
        updateDoc(doc(db, "users", user.uid), {
          projectPictureFive: response,
        })
          .then(() => {
            //all good
          })
          .catch((error) => {
            // no bueno
          });
      });
    }

    onCloseProject();
  };

  const uploadToFirebase = async () => {
    const storage = getStorage();
    const pictureRef = ref(
      storage,
      "users/" + user.uid + "/profilePicture.jpg"
    );

    // setImage(result.assets[0].uri);
    // dispatch(selectUserProfilePicture(result.assets[0].uri))

    const img = await fetch(images[0].data_url);
    const bytes = await img.blob();

    await uploadBytes(pictureRef, bytes).then((snapshot) => {});

    await getDownloadURL(pictureRef).then((response) => {
      updateDoc(doc(db, "users", user.uid), {
        profilePictureResponse: response,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    });

    setTimeout(() => {
      updateDoc(doc(db, "users", user.uid), {
        hasUploadedProfilePicture: hasUploadedProfilePicture,
      })
        .then(() => {
          setHasUploadedProfilePicture(hasUploadedProfilePicture);
        })
        .catch((error) => {
          // no bueno
        });
    });

    onCloseAvatar();
  };

  const [subscriptionID, setSubscriptionID] = useState(null);

  const initializeSubscription = () => {
    //credit and help from https://github.com/pagecow/stripe-subscribe-payments
    fetch("https://fulfil-api.onrender.com/create-subscription-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ session }) => {
        setSubscriptionID(session.id);
        window.open(session.url, "_blank");
      })
      // .then(({ url }) => {
      //   // window.location = url
      //   window.open(url, "_blank")
      // })
      .catch((e) => {
        console.error(e.error);
      });
  };

  useEffect(() => {
    if (subscriptionID) {
      updateDoc(doc(db, "users", user.uid), {
        subscriptionID: subscriptionID,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    }
  }, [subscriptionID]);

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <Header />

      <Box position="absolute" left="0">
        <Dashboard />
      </Box>
      <main id="content" class="lg:ps-[260px] pt-[59px]">
        <div class="max-w-6xl mx-auto">
          <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
            <div class="p-5 pb-0 bg-white border border-gray-200 shadow-sm rounded-xl ">
              <figure>
                <svg
                  class="w-full"
                  preserveAspectRatio="none"
                  width="1113"
                  height="161"
                  viewBox="0 0 1113 161"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_666_220723)">
                    <rect
                      x="0.5"
                      width="1112"
                      height="161"
                      rx="12"
                      fill="white"
                    ></rect>
                    <rect x="1" width="1112" height="348" fill="#D9DEEA"></rect>
                    <path
                      d="M512.694 359.31C547.444 172.086 469.835 34.2204 426.688 -11.3096H1144.27V359.31H512.694Z"
                      fill="#C0CBDD"
                    ></path>
                    <path
                      d="M818.885 185.745C703.515 143.985 709.036 24.7949 726.218 -29.5801H1118.31V331.905C1024.49 260.565 963.098 237.945 818.885 185.745Z"
                      fill="#8192B0"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_666_220723">
                      <rect
                        x="0.5"
                        width="1112"
                        height="161"
                        rx="12"
                        fill="white"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
              </figure>

              {/* {profilePicture ? (<img
                    class="object-cover size-full rounded-full"
                    src={profilePicture}
                    
                    alt="Image Description"
                  />) :  ( <svg class="size-full text-gray-500" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.62854" y="0.359985" width="15" height="15" rx="7.5" fill="white"></rect>
                  <path d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z" fill="currentColor"></path>
                  <path d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z" fill="currentColor"></path>
                </svg>) } */}

              <div class="-mt-24">
                <div class="relative flex w-[120px] h-[120px] mx-auto border-4 border-white rounded-full ">
                  {profilePicture ? (
                    <img
                      class="object-cover size-full rounded-full"
                      src={profilePicture}
                      alt="Image Description"
                    />
                  ) : (
                    <svg
                      class="size-full text-gray-500"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.62854"
                        y="0.359985"
                        width="15"
                        height="15"
                        rx="7.5"
                        fill="white"
                      ></rect>
                      <path
                        d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  )}

                  <div class="absolute bottom-0 -end-2">
                    <button
                      type="button"
                      onClick={() => onOpenAvatar()}
                      class="group p-2 max-w-[125px] inline-flex justify-center items-center gap-x-1.5 text-start bg-white border border-gray-200 text-gray-800 text-xs font-medium rounded-full whitespace-nowrap shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:bg-gray-100 "
                      data-hs-overlay="#hs-pro-dsm"
                    >
                      <svg
                        class="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" x2="9.01" y1="9" y2="9" />
                        <line x1="15" x2="15.01" y1="9" y2="9" />
                      </svg>
                      <span class="group-hover:block hidden">
                        Change Picture
                      </span>
                    </button>
                  </div>
                </div>

                <Modal
                  isOpen={isOpenAvatar}
                  onClose={onCloseAvatar}
                  size="xl"
                  height="420px"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <div
                      id="hs-pro-dasadpm"
                      class=" size-full fixed top-0 start-0 z-[80]  overflow-y-auto pointer-events-none [--close-when-click-inside:true] "
                    >
                      <div class="mt-7 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                        <div class="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] ">
                          <div class="py-3 px-4 flex justify-between items-center border-b ">
                            <h3 class="font-semibold text-gray-800 ">
                              Profile Picture
                            </h3>
                            <button
                              type="button"
                              onClick={() => onCloseAvatar()}
                              class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                              data-hs-overlay="#hs-pro-dasadpm"
                            >
                              <span class="sr-only">Close</span>
                              <svg
                                class="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                              </svg>
                            </button>
                          </div>

                          <form>
                            <div class="p-4 space-y-5">
                              <div>
                                <div class="flex flex-wrap items-center gap-3 sm:gap-5">
                                  <img
                                    src={
                                      profilePicture ? (
                                        profilePicture
                                      ) : images ? (
                                        images
                                      ) : (
                                        <span class="flex flex-shrink-0 justify-center items-center size-20 border-2 border-dotted border-gray-300 text-gray-400 rounded-full dark:border-neutral-700 dark:text-neutral-600">
                                          <svg
                                            class="flex-shrink-0 size-7"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="1"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          >
                                            <rect
                                              width="18"
                                              height="18"
                                              x="3"
                                              y="3"
                                              rx="2"
                                              ry="2"
                                            />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                          </svg>
                                        </span>
                                      )
                                    }
                                  ></img>

                                  <div class="grow">
                                    <div class="flex items-center gap-x-2">
                                      <ImageUploading
                                        multiple
                                        value={images}
                                        onChange={onChange}
                                        maxNumber={maxNumber}
                                        dataURLKey="data_url"
                                      >
                                        {({
                                          imageList,
                                          onImageUpload,
                                          onImageRemoveAll,
                                          onImageUpdate,
                                          onImageRemove,
                                          isDragging,
                                          dragProps,
                                        }) => (
                                          // write your building UI
                                          <div className="upload__image-wrapper">
                                            <button
                                              type="button"
                                              onClick={() => onImageUpdate()}
                                              {...dragProps}
                                              class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                              <svg
                                                class="flex-shrink-0 size-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                              >
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line
                                                  x1="12"
                                                  x2="12"
                                                  y1="3"
                                                  y2="15"
                                                />
                                              </svg>
                                              Upload photo
                                            </button>
                                            &nbsp;
                                          </div>
                                        )}
                                      </ImageUploading>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="p-4 flex justify-end gap-x-2">
                              <div class="w-full flex justify-end items-center gap-x-2">
                                <button
                                  type="button"
                                  onClick={() => onCloseAvatar()}
                                  class="py-2 px-3  inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 "
                                  data-hs-overlay="#hs-pro-dasadpm"
                                >
                                  Cancel
                                </button>

                                <button
                                  type="button"
                                  onClick={() => uploadToFirebase()}
                                  class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                  data-hs-overlay="#hs-pro-dasadpm"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </ModalContent>
                </Modal>

                <div class="mt-3 text-center">
                  <h1 class="text-xl font-semibold text-gray-800 ">
                    {userFirstName} {userLastName}
                  </h1>
                  {/* <p class="text-gray-500 ">
                          iam_amanda
                        </p> */}
                </div>
              </div>
            </div>

            {isDesktop ? null : (
              <>
                {" "}
                <div class="xl:ps-5 grow space-y-5">
                  <div class="flex flex-col bg-white  rounded-xl shadow-sm xl:shadow-none ">
                    {/* Start about */}
                    <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                      <div class="xl:pe-4 mt-3 space-y-5 divide-y divide-gray-200 ">
                        <div class="pt-4 first:pt-0">
                          <h2 class="text-sm font-semibold text-gray-800 ">
                            Details ss
                          </h2>

                          <ul class="mt-3 space-y-2">
                            {businessName ? (
                              <li>
                                <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                  <svg
                                    class="flex-shrink-0 size-4 text-gray-600 "
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  >
                                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                    <path d="M10 6h4" />
                                    <path d="M10 10h4" />
                                    <path d="M10 14h4" />
                                    <path d="M10 18h4" />
                                  </svg>
                                </div>
                              </li>
                            ) : null}

                            <li>
                              <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                <svg
                                  class="flex-shrink-0 size-4 text-gray-600 "
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {userCity}, {userState}
                              </div>
                            </li>
                            {/* <li>
                              <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                {numberOfRatings ? (
                                  <Flex>
                                    {maxRating.map((item, key) => {
                                      return (
                                        <Box
                                          activeopacity={0.7}
                                          key={item}
                                          marginTop="4px"
                                        >
                                          <Image
                                            boxSize="16px"
                                            src={
                                              item <= rating
                                                ? star_filled
                                                : star_corner
                                            }
                                          ></Image>
                                        </Box>
                                      );
                                    })}

                                    <Text marginTop="4px" marginLeft="4px">
                                      ({numberOfRatings} reviews)
                                    </Text>
                                  </Flex>
                                ) : (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="flex-shrink-0 size-4 text-gray-600 "
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                      />
                                    </svg>
                                    <Text>No reviews yet</Text>
                                  </>
                                )}
                              </div>
                            </li> */}
                            <li>
                              <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                <svg
                                  class="flex-shrink-0 size-4 text-gray-600 "
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                  />
                                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                {email}
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div class="w-full">
<div class="pt-4 first:pt-0 flex flex-row ">
  <h2 class="mb-2  mt-2 text-sm font-semibold text-gray-800 ">
    Specialties
  </h2>
  <button onClick={onOpenCategories}>
    <svg
      type="button"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#5D5D5D"
      class="w-4 h-4 ml-2 mb-2 hover:text-gray-700"
    >
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
  </button>
</div>
<div>
  {isPremium ? (
    <ul class="space-y-2 items-center">
      {!userInfo.premiumCategoryOne &&
      !userInfo.premiumCategoryTwo &&
      !userInfo.premiumCategoryThree ? (
        <button
          type="button"
          class="p-2 w-1/2 text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
          data-hs-overlay="#hs-pro-dasadpm"
          onClick={onOpenCategories}
        >
          Add Specialty
        </button>
      ) : (
        <>
          {userInfo.premiumCategoryOne ? (
            <>
              <li>
                <a
                  class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                  href="#"
                >
                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white rounded-lg ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#38bdf8"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div class="grow">
                    <p>{userInfo.premiumCategoryOne}</p>
                  </div>
                </a>
              </li>

              {userInfo.premiumCategoryTwo ? null : (
                <button
                  type="button"
                  class="p-2 w-1/2 text-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                  data-hs-overlay="#hs-pro-dasadpm"
                  onClick={onOpenCategories}
                >
                  Add 
                </button>
              )}
            </>
          ) : null}

          {userInfo.premiumCategoryTwo ? (
            <>
              <li>
                <a
                  class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                  href="#"
                >
                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white rounded-lg ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#38bdf8"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div class="grow">
                    <p>{userInfo.premiumCategoryTwo}</p>
                  </div>
                </a>
              </li>
              {userInfo.premiumCategoryThree ? null : (
                <button
                  type="button"
                  class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                  onClick={onOpenCategories}
                >
                  Add
                </button>
              )}
            </>
          ) : null}
          {userInfo.premiumCategoryThree ? (
            <>
              <li>
                <a
                  class="p-2.5 flex items-center gap-x-3 bg-white text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                  href="#"
                >
                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#38bdf8"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div class="grow">
                    <p>{userInfo.premiumCategoryThree}</p>
                  </div>
                </a>
              </li>
              {userInfo.premiumCategoryFour ? null : (
                <div className="w-full ">
                <button
                  type="button"
                  class="p-2 w-full  justify-end text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                  data-hs-overlay="#hs-pro-dasadpm"
                  onClick={onOpenCategories}
                >
                  Add
                </button>
                </div>
              )}
            </>
          ) : null}
          {userInfo.premiumCategoryFour ? (
            <>
              <li>
                <a
                  class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                  href="#"
                >
                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#38bdf8"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div class="grow">
                    <p>{userInfo.premiumCategoryFour}</p>
                  </div>
                </a>
              </li>
              {userInfo.premiumCategoryFive ? null : (
                <button
                  type="button"
                  class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                  data-hs-overlay="#hs-pro-dasadpm"
                  onClick={onOpenCategories}
                >
                  Add
                </button>
              )}
            </>
          ) : null}
          {userInfo.premiumCategoryFive ? (
            <>
              <li>
                <a
                  class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                  href="#"
                >
                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#38bdf8"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div class="grow">
                    <p>{userInfo.premiumCategoryFive}</p>
                  </div>
                </a>
              </li>
            </>
          ) : null}
        </>
      )}
    </ul>
  ) : (
    <button
      type="button"
      class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none  "
      data-hs-overlay="#hs-pro-dasadpm"
      onClick={onOpenCategories}
    >
      Add Specialty
    </button>
  )}
</div>
</div> */}
              </>
            )}

            <div class="xl:p-5 flex flex-col xl:bg-white xl:border xl:border-gray-200 xl:shadow-sm xl:rounded-xl ">
              <div class="xl:flex">
                <div
                  id="hs-pro-dupsd"
                  class="hs-overlay [--auto-close:xl] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-[320px] bg-white p-5 overflow-y-auto xl:relative xl:z-0 xl:block xl:translate-x-0 xl:end-auto xl:bottom-0 xl:p-0 border-e border-gray-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 "
                >
                  <div class="xl:hidden">
                    <div class="absolute top-2 end-4 z-10">
                      <button
                        type="button"
                        class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-pro-dupsd"
                      >
                        <span class="sr-only">Close</span>
                        <svg
                          class="flex-shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="xl:pe-4 mt-3 space-y-5 divide-y divide-gray-200 ">
                    <div class="pt-4 first:pt-0">
                      <h2 class="text-sm font-semibold text-gray-800 ">
                        Details
                      </h2>

                      <ul class="mt-3 space-y-2">
                        {businessName ? (
                          <li>
                            <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                              <svg
                                class="flex-shrink-0 size-4 text-gray-600 "
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                <path d="M10 6h4" />
                                <path d="M10 10h4" />
                                <path d="M10 14h4" />
                                <path d="M10 18h4" />
                              </svg>
                            </div>
                          </li>
                        ) : null}

                        <li>
                          <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            <svg
                              class="flex-shrink-0 size-4 text-gray-600 "
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {userCity}, {userState}
                          </div>
                        </li>
                        {/* <li>
                          <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            {numberOfRatings ? (
                              <Flex>
                                {maxRating.map((item, key) => {
                                  return (
                                    <Box
                                      activeopacity={0.7}
                                      key={item}
                                      marginTop="4px"
                                    >
                                      <Image
                                        boxSize="16px"
                                        src={
                                          item <= rating
                                            ? star_filled
                                            : star_corner
                                        }
                                      ></Image>
                                    </Box>
                                  );
                                })}

                                <Text marginTop="4px" marginLeft="4px">
                                  ({numberOfRatings} reviews)
                                </Text>
                              </Flex>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="flex-shrink-0 size-4 text-gray-600 "
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                  />
                                </svg>
                                <Text>No reviews yet</Text>
                              </>
                            )}
                          </div>
                        </li> */}
                        <li>
                          <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            <svg
                              class="flex-shrink-0 size-4 text-gray-600 "
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <rect width="20" height="16" x="2" y="4" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            {email}
                          </div>
                        </li>
                      </ul>

                      {resume ? // <button onClick={() => onOpenResume()}>
                      //   view resume
                      // </button>
                      null : ( null
                        // <label
                        //   for="resume-upload"
                        //   class="mt-4 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none "
                        // >
                        //   Upload Resume
                        //   <input
                        //     id="resume-upload"
                        //     className="hidden"
                        //     type="file"
                        //     accept=".pdf"
                        //     // onChange={(event) => setNewResume({ selectedFile: event.target.files[0] })}
                        //     onChange={(event) =>
                        //       uploadResumeToFirebase(event.target.files[0])
                        //     }
                        //   />
                        // </label>
                      )}

                      <Modal
                        isOpen={isOpenResume}
                        onClose={onCloseResume}
                        size="5xl"
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <div>
                            <Document
                              className=""
                              file={resume ? resume : null}
                              onLoadSuccess={onDocumentLoadSuccess}
                            >
                              <Page
                                className=""
                                height="500"
                                width="1000"
                                pageNumber={pageNumber}
                              />
                            </Document>
                            {/* <iframe title="pds" src={resume ? resume : null} width="100%" height="500px" /> */}
                            <p>
                              Page {pageNumber} of {numPages}
                            </p>
                          </div>
                        </ModalContent>
                      </Modal>
                    </div>

                    {/* <div class="w-full">
                      <div class="pt-4 first:pt-0 flex flex-row ">
                        <h2 class="mb-2  mt-2 text-sm font-semibold text-gray-800 ">
                          Specialties
                        </h2>
                        <button onClick={onOpenCategories}>
                          <svg
                            type="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#5D5D5D"
                            class="w-4 h-4 ml-2 mb-2 hover:text-gray-700"
                          >
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                          </svg>
                        </button>
                      </div>
                      <div>
                        {isPremium ? (
                          <ul class="space-y-2 items-center">
                            {!userInfo.premiumCategoryOne &&
                            !userInfo.premiumCategoryTwo &&
                            !userInfo.premiumCategoryThree ? (
                              <button
                                type="button"
                                class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                data-hs-overlay="#hs-pro-dasadpm"
                                onClick={onOpenCategories}
                              >
                                Add Specialty
                              </button>
                            ) : (
                              <>
                                {userInfo.premiumCategoryOne ? (
                                  <>
                                    <li>
                                      <a
                                        class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                        href="#"
                                      >
                                        <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white rounded-lg ">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#38bdf8"
                                            className="w-6 h-6"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </span>
                                        <div class="grow">
                                          <p>{userInfo.premiumCategoryOne}</p>
                                        </div>
                                      </a>
                                    </li>

                                    {userInfo.premiumCategoryTwo ? null : (
                                      <button
                                        type="button"
                                        class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                        data-hs-overlay="#hs-pro-dasadpm"
                                        onClick={onOpenCategories}
                                      >
                                        Add
                                      </button>
                                    )}
                                  </>
                                ) : null}

                                {userInfo.premiumCategoryTwo ? (
                                  <>
                                    <li>
                                      <a
                                        class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                        href="#"
                                      >
                                        <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white rounded-lg ">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#38bdf8"
                                            className="w-6 h-6"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </span>
                                        <div class="grow">
                                          <p>{userInfo.premiumCategoryTwo}</p>
                                        </div>
                                      </a>
                                    </li>
                                    {userInfo.premiumCategoryThree ? null : (
                                      <button
                                        type="button"
                                        class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                        onClick={onOpenCategories}
                                      >
                                        Add
                                      </button>
                                    )}
                                  </>
                                ) : null}
                                {userInfo.premiumCategoryThree ? (
                                  <>
                                    <li>
                                      <a
                                        class="p-2.5 flex items-center gap-x-3 bg-white text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                        href="#"
                                      >
                                        <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#38bdf8"
                                            className="w-6 h-6"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </span>
                                        <div class="grow">
                                          <p>{userInfo.premiumCategoryThree}</p>
                                        </div>
                                      </a>
                                    </li>
                                    {userInfo.premiumCategoryFour ? null : (
                                      <button
                                        type="button"
                                        class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                        data-hs-overlay="#hs-pro-dasadpm"
                                        onClick={onOpenCategories}
                                      >
                                        Add
                                      </button>
                                    )}
                                  </>
                                ) : null}
                                {userInfo.premiumCategoryFour ? (
                                  <>
                                    <li>
                                      <a
                                        class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                        href="#"
                                      >
                                        <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#38bdf8"
                                            className="w-6 h-6"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </span>
                                        <div class="grow">
                                          <p>{userInfo.premiumCategoryFour}</p>
                                        </div>
                                      </a>
                                    </li>
                                    {userInfo.premiumCategoryFive ? null : (
                                      <button
                                        type="button"
                                        class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                        data-hs-overlay="#hs-pro-dasadpm"
                                        onClick={onOpenCategories}
                                      >
                                        Add
                                      </button>
                                    )}
                                  </>
                                ) : null}
                                {userInfo.premiumCategoryFive ? (
                                  <>
                                    <li>
                                      <a
                                        class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                        href="#"
                                      >
                                        <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#38bdf8"
                                            className="w-6 h-6"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </span>
                                        <div class="grow">
                                          <p>{userInfo.premiumCategoryFive}</p>
                                        </div>
                                      </a>
                                    </li>
                                  </>
                                ) : null}
                              </>
                            )}
                          </ul>
                        ) : (
                          <button
                            type="button"
                            class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none  "
                            data-hs-overlay="#hs-pro-dasadpm"
                            onClick={onOpenCategories}
                          >
                            Add Specialty
                          </button>
                        )}
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* start specialty modal */}

                <Modal
                  isOpen={isOpenCategories}
                  onClose={onCloseCategories}
                  size="xl"
                >
                  <ModalOverlay />
                  <ModalContent>
                    {isUploaded ? (
                      <>
                        <Box padding={8}>
                          <Heading size="md">Success!</Heading>
                          <Text>
                            Your choices have been updated successfully! It may
                            take a few minutes before it shows on your profile.
                          </Text>
                        </Box>{" "}
                      </>
                    ) : isPremium ? (
                      <>
                        <div
                          id="hs-pro-dasadpm"
                          class=" size-full fixed top-0 start-0 z-[80]  overflow-y-auto pointer-events-none [--close-when-click-inside:true] "
                        >
                          <div class="mt-7 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                            <div class="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] ">
                              <div class="py-3 px-4 flex justify-between items-center border-b ">
                                <h3 class="font-semibold text-gray-800 ">
                                  Add your specialties
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => onCloseCategories()}
                                  class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                  data-hs-overlay="#hs-pro-dasadpm"
                                >
                                  <span class="sr-only">Close</span>
                                  <svg
                                    class="flex-shrink-0 size-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                  </svg>
                                </button>
                              </div>

                              <form>
                                <div class="p-4 space-y-5">
                                  <div>
                                    <label
                                      for="hs-pro-dalpn"
                                      class="block mb-2 text-sm font-medium text-gray-800 "
                                    >
                                      Specialty One
                                    </label>
                                    <select
                                      class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                      defaultValue={
                                        userInfo.premiumCategoryOne
                                          ? userInfo.premiumCategoryOne
                                          : "Choose a category"
                                      }
                                      onChange={(e) =>
                                        setPremiumCategoryOne(e.target.value)
                                      }
                                    >
                                      <option value={false}>
                                        Select category
                                      </option>
                                      <option value="null">
                                        Clear Selection
                                      </option>
                                      <option value="Asphalt">Asphalt</option>
                                      <option value="Carpentry">
                                        Carpentry
                                      </option>
                                      <option value="Concrete">Concrete</option>
                                      <option value="Drywall">Drywall</option>
                                      <option value="Electrical work">
                                        Electrical Work
                                      </option>
                                      <option value="General handyman">
                                        General Handyman
                                      </option>
                                      <option value="Gutter cleaning">
                                        Gutter Cleaning
                                      </option>
                                      <option value="Hvac">HVAC</option>
                                      <option value="Landscaping">
                                        Landscaping
                                      </option>
                                      <option value="Painting">Painting</option>
                                      <option value="Plumbing">Plumbing</option>
                                      <option value="Pressure washing">
                                        Pressure Washing
                                      </option>
                                      <option value="Roofing">Roofing</option>
                                      <option value="Siding">Siding</option>
                                      <option value="Snow removal">
                                        Snow Removal
                                      </option>
                                      <option value="Window installation">
                                        Window Installation
                                      </option>
                                      <option value="Window washing">
                                        Window Washing
                                      </option>
                                      <option value="Yard work">
                                        Yard Work
                                      </option>
                                      <option value={false}>
                                        Clear Selection
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                <div class="p-4 space-y-5">
                                  <div>
                                    <label
                                      for="hs-pro-dalpn"
                                      class="block mb-2 text-sm font-medium text-gray-800 "
                                    >
                                      Specialty Two
                                    </label>
                                    <select
                                      class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                      defaultValue={
                                        userInfo.premiumCategoryTwo
                                          ? userInfo.premiumCategoryTwo
                                          : "Choose a category"
                                      }
                                      onChange={(e) =>
                                        setPremiumCategoryTwo(e.target.value)
                                      }
                                    >
                                      <option value={false}>
                                        Select category
                                      </option>
                                      <option value="null">
                                        Clear Selection
                                      </option>
                                      <option value="Asphalt">Asphalt</option>
                                      <option value="Carpentry">
                                        Carpentry
                                      </option>
                                      <option value="Concrete">Concrete</option>
                                      <option value="Drywall">Drywall</option>
                                      <option value="Electrical work">
                                        Electrical Work
                                      </option>
                                      <option value="General handyman">
                                        General Handyman
                                      </option>
                                      <option value="Gutter cleaning">
                                        Gutter Cleaning
                                      </option>
                                      <option value="Hvac">HVAC</option>
                                      <option value="Landscaping">
                                        Landscaping
                                      </option>
                                      <option value="Painting">Painting</option>
                                      <option value="Plumbing">Plumbing</option>
                                      <option value="Pressure washing">
                                        Pressure Washing
                                      </option>
                                      <option value="Roofing">Roofing</option>
                                      <option value="Siding">Siding</option>
                                      <option value="Snow removal">
                                        Snow Removal
                                      </option>
                                      <option value="Window installation">
                                        Window Installation
                                      </option>
                                      <option value="Window washing">
                                        Window Washing
                                      </option>
                                      <option value="Yard work">
                                        Yard Work
                                      </option>
                                      <option value={false}>
                                        Clear Selection
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                <div class="p-4 space-y-5">
                                  <div>
                                    <label
                                      for="hs-pro-dalpn"
                                      class="block mb-2 text-sm font-medium text-gray-800 "
                                    >
                                      Specialty Three
                                    </label>
                                    <select
                                      class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                      defaultValue={
                                        userInfo.premiumCategoryThree
                                          ? userInfo.premiumCategoryThree
                                          : "Choose a category"
                                      }
                                      onChange={(e) =>
                                        setPremiumCategoryThree(e.target.value)
                                      }
                                    >
                                      <option value={false}>
                                        Select category
                                      </option>
                                      <option value="null">
                                        Clear Selection
                                      </option>
                                      <option value="Asphalt">Asphalt</option>
                                      <option value="Carpentry">
                                        Carpentry
                                      </option>
                                      <option value="Concrete">Concrete</option>
                                      <option value="Drywall">Drywall</option>
                                      <option value="Electrical work">
                                        Electrical Work
                                      </option>
                                      <option value="General handyman">
                                        General Handyman
                                      </option>
                                      <option value="Gutter cleaning">
                                        Gutter Cleaning
                                      </option>
                                      <option value="Hvac">HVAC</option>
                                      <option value="Landscaping">
                                        Landscaping
                                      </option>
                                      <option value="Painting">Painting</option>
                                      <option value="Plumbing">Plumbing</option>
                                      <option value="Pressure washing">
                                        Pressure Washing
                                      </option>
                                      <option value="Roofing">Roofing</option>
                                      <option value="Siding">Siding</option>
                                      <option value="Snow removal">
                                        Snow Removal
                                      </option>
                                      <option value="Window installation">
                                        Window Installation
                                      </option>
                                      <option value="Window washing">
                                        Window Washing
                                      </option>
                                      <option value="Yard work">
                                        Yard Work
                                      </option>
                                      <option value={false}>
                                        Clear Selection
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div class="p-4 space-y-5">
                                  <div>
                                    <label
                                      for="hs-pro-dalpn"
                                      class="block mb-2 text-sm font-medium text-gray-800 "
                                    >
                                      Specialty Four
                                    </label>
                                    <select
                                      class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                      defaultValue={
                                        userInfo.premiumCategoryFour
                                          ? userInfo.premiumCategoryFour
                                          : "Choose a category"
                                      }
                                      onChange={(e) =>
                                        setPremiumCategoryFour(e.target.value)
                                      }
                                    >
                                      <option value={false}>
                                        Select category
                                      </option>
                                      <option value="null">
                                        Clear Selection
                                      </option>
                                      <option value="Asphalt">Asphalt</option>
                                      <option value="Carpentry">
                                        Carpentry
                                      </option>
                                      <option value="Concrete">Concrete</option>
                                      <option value="Drywall">Drywall</option>
                                      <option value="Electrical work">
                                        Electrical Work
                                      </option>
                                      <option value="General handyman">
                                        General Handyman
                                      </option>
                                      <option value="Gutter cleaning">
                                        Gutter Cleaning
                                      </option>
                                      <option value="Hvac">HVAC</option>
                                      <option value="Landscaping">
                                        Landscaping
                                      </option>
                                      <option value="Painting">Painting</option>
                                      <option value="Plumbing">Plumbing</option>
                                      <option value="Pressure washing">
                                        Pressure Washing
                                      </option>
                                      <option value="Roofing">Roofing</option>
                                      <option value="Siding">Siding</option>
                                      <option value="Snow removal">
                                        Snow Removal
                                      </option>
                                      <option value="Window installation">
                                        Window Installation
                                      </option>
                                      <option value="Window washing">
                                        Window Washing
                                      </option>
                                      <option value="Yard work">
                                        Yard Work
                                      </option>
                                      <option value={false}>
                                        Clear Selection
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                <div class="p-4 space-y-5">
                                  <div>
                                    <label
                                      for="hs-pro-dalpn"
                                      class="block mb-2 text-sm font-medium text-gray-800 "
                                    >
                                      Specialty Five
                                    </label>
                                    <select
                                      class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                      defaultValuer={
                                        userInfo.premiumCategoryFive
                                          ? userInfo.premiumCategoryFive
                                          : "Choose a category"
                                      }
                                      onChange={(e) =>
                                        setPremiumCategoryFive(e.target.value)
                                      }
                                    >
                                      <option value={false}>
                                        Select category
                                      </option>
                                      <option value="null">
                                        Clear Selection
                                      </option>
                                      <option value="Asphalt">Asphalt</option>
                                      <option value="Carpentry">
                                        Carpentry
                                      </option>
                                      <option value="Concrete">Concrete</option>
                                      <option value="Drywall">Drywall</option>
                                      <option value="Electrical work">
                                        Electrical Work
                                      </option>
                                      <option value="General handyman">
                                        General Handyman
                                      </option>
                                      <option value="Gutter cleaning">
                                        Gutter Cleaning
                                      </option>
                                      <option value="Hvac">HVAC</option>
                                      <option value="Landscaping">
                                        Landscaping
                                      </option>
                                      <option value="Painting">Painting</option>
                                      <option value="Plumbing">Plumbing</option>
                                      <option value="Pressure washing">
                                        Pressure Washing
                                      </option>
                                      <option value="Roofing">Roofing</option>
                                      <option value="Siding">Siding</option>
                                      <option value="Snow removal">
                                        Snow Removal
                                      </option>
                                      <option value="Window installation">
                                        Window Installation
                                      </option>
                                      <option value="Window washing">
                                        Window Washing
                                      </option>
                                      <option value="Yard work">
                                        Yard Work
                                      </option>
                                      <option value={false}>
                                        Clear Selection
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                <div class="p-4 flex justify-end gap-x-2">
                                  <div class="w-full flex justify-end items-center gap-x-2">
                                    <button
                                      type="button"
                                      onClick={() => onCloseCategories()}
                                      class="py-2 px-3  inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 "
                                      data-hs-overlay="#hs-pro-dasadpm"
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAllFBCategoryChange()
                                      }
                                      class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                      data-hs-overlay="#hs-pro-dasadpm"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <ModalBody>
                        <p>
                          Upgrade to Pro to add your specialties and be seen by
                          more people looking for contractors!
                        </p>
                      </ModalBody>
                    )}
                    {isUploaded ? (
                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          onClick={() => handleCloseCategories()}
                        >
                          Continue
                        </Button>
                      </ModalFooter>
                    ) : isPremium ? null : (
                      <ModalFooter>
                        <Button
                          variant="ghost"
                          mr={3}
                          onClick={onCloseCategories}
                        >
                          Close
                        </Button>
                        <Button
                          colorScheme="blue"
                          onClick={() => initializeSubscription()}
                        >
                          Upgrade
                        </Button>
                      </ModalFooter>
                    )}
                  </ModalContent>
                </Modal>

                {/* end specialty modal */}

                <div class="xl:ps-5 grow space-y-1 mt-2">
                  {resume ? (
                    <>
                      <div class="flex  flex-col bg-white border border-gray-200 rounded-xl shadow-sm xl:shadow-none ">
                        <div class="px-5 py-5  flex flex-column sm:flex sm:justify-between sm:items-center gap-2">
                          <h2 class="inline-block font-semibold text-gray-800  ">
                            Resume Uploaded
                          </h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#008000"
                            class="size-6"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                        <div class="items-center align-center justify-center text-center">
                          <div class="items-center p-5   flex flex-column sm:flex sm:justify-between sm:items-center gap-2">
                            <div class="mt-4 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none ">
                              <button onClick={() => onOpenResume()}>
                                View
                              </button>
                            </div>
                          </div>
                          <div class="px-5  flex flex-column sm:flex sm:justify-between sm:items-center gap-2">
                            <div className="items-center justify-center">
                              <button>or</button>
                            </div>
                          </div>
                          {/* help from Nexo & Josh Crozier https://stackoverflow.com/questions/572768/styling-an-input-type-file-button */}
                          <div class="px-5   flex flex-column sm:flex sm:justify-between sm:items-center gap-2">
                            <div className="items-center justify-center">
                              <label
                                for="resume-upload"
                                class="mt-4 py-2  inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-sky-500 hover:text-sky-600 underline cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus:outline-none "
                              >
                                Upload new resume
                                <input
                                  id="resume-upload"
                                  className="hidden"
                                  type="file"
                                  accept=".pdf"
                                  // onChange={(event) => setNewResume({ selectedFile: event.target.files[0] })}
                                  onChange={(event) =>
                                    uploadResumeToFirebase(
                                      event.target.files[0]
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div class="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm xl:shadow-none ">
                      <div class="p-5 pb-2  flex flex-column sm:flex sm:justify-between sm:items-center gap-2">
                        <h2 class="inline-block font-semibold text-gray-800 ">
                          Resume
                        </h2>

                        {userBio ? (
                          <div class="flex sm:justify-end items-center gap-x-2">
                            <button type="button" onClick={() => onOpenBio()}>
                              <svg
                                type="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#5D5D5D"
                                class="w-4 h-4 ml-2 mb-2 hover:text-gray-700"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                              </svg>
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <Modal isOpen={isOpenBio} onClose={onCloseBio} size="xl">
                        <ModalOverlay />
                        <ModalContent>
                          <div
                            id="hs-pro-dasadpm"
                            class=" size-full fixed top-0 start-0 z-[80]  overflow-y-auto pointer-events-none [--close-when-click-inside:true] "
                          >
                            <div class="mt-7 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                              <div class="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] ">
                                <div class="py-3 px-4 flex justify-between items-center border-b ">
                                  <h3 class="font-semibold text-gray-800 ">
                                    Add your bio
                                  </h3>
                                  <button
                                    type="button"
                                    onClick={() => onCloseBio()}
                                    class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                    data-hs-overlay="#hs-pro-dasadpm"
                                  >
                                    <span class="sr-only">Close</span>
                                    <svg
                                      class="flex-shrink-0 size-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    >
                                      <path d="M18 6 6 18" />
                                      <path d="m6 6 12 12" />
                                    </svg>
                                  </button>
                                </div>

                                <form>
                                  <div class="p-4 space-y-5">
                                    <div>
                                      <label
                                        for="hs-pro-dalpn"
                                        class="block mb-2 text-sm font-medium text-gray-800 "
                                      >
                                        About Me
                                      </label>

                                      <textarea
                                        type="text"
                                        defaultValue={userBio}
                                        onChange={(e) =>
                                          setUpdatedBio(e.target.value)
                                        }
                                        id="hs-pro-dalpn"
                                        rows="5"
                                        class="  sm:p-5 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                        placeholder="ex: I am a dedicated landscaper with over 10 years of experience in the field."
                                      />
                                    </div>
                                  </div>

                                  <div class="p-4 flex justify-end gap-x-2">
                                    <div class="w-full flex justify-end items-center gap-x-2">
                                      <button
                                        type="button"
                                        onClick={() => onCloseBio()}
                                        class="py-2 px-3  inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 "
                                        data-hs-overlay="#hs-pro-dasadpm"
                                      >
                                        Cancel
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateUserProfileFirestore()
                                        }
                                        class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                        data-hs-overlay="#hs-pro-dasadpm"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </ModalContent>
                      </Modal>

                      {userBio ? (
                        <div class=" text-left flex justify-start w-full  bg-white  rounded-xl ">
                          <div class="h-full p-6">
                            <p class=" text-md  text-black ">{userBio}</p>
                          </div>
                          {/* <!-- End Body --> */}
                        </div>
                      ) : (
                        <div class="p-5 min-h-[160px] flex flex-col justify-center items-center text-center">
                          {" "}
                          <div class="max-w-sm mx-auto">
                            <p class="mt-2 font-medium text-gray-800 ">
                              Nothing here.
                            </p>
                            <p class="mb-5 text-sm text-gray-500 "></p>
                          </div>
                        
                          <p className="cursor-pointer mt-2">
                            upload your resume{" "}
                            <label
                              for="resume-upload"
                              class="cursor-pointer text-sky-500 underline hover:text-sky-600 "
                            >
                              here
                              <input
                                id="resume-upload"
                                className="hidden"
                                type="file"
                                accept=".pdf"
                                // onChange={(event) => setNewResume({ selectedFile: event.target.files[0] })}
                                onChange={(event) =>
                                  uploadResumeToFirebase(event.target.files[0])
                                }
                              />
                            </label>
                          </p>
                          <p className="cursor-pointer mt-2">
                            Need to make a resume? Get started{" "}
                            <label
                              for="resume-upload"
                              class="cursor-pointer text-sky-500 underline hover:text-sky-600"
                              onClick={() =>
                                window.open(
                                  "https://gdoc.io/resume-templates/",
                                  "_blank"
                                )
                              }
                            >
                              here.
                            </label>
                            <p className="cursor-pointer mt-2">(Make sure you download the file as a pdf)</p>
                          </p>
                        </div>
                      )}
                    

                      {userExperience ? (
                        userExperience.map((userExperience) => (
                          <>
                            <div class="p-3">
                              <div class=" text-left flex justify-start w-full  bg-white border   border-gray-200 rounded-xl ">
                                <div
                                  class="h-full p-6 "
                                  key={userExperience.id}
                                >
                                  <h2 class="text-xl font-semibold text-gray-800 0">
                                    {userExperience.Title}
                                    <button
                                      onClick={() =>
                                        handleOpenEditExperienceModal(
                                          userExperience.id
                                        )
                                      }
                                    >
                                      <svg
                                        type="button"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="#5D5D5D"
                                        class="w-4 h-4 ml-2 mb-2 hover:text-gray-700"
                                      >
                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                      </svg>
                                    </button>
                                  </h2>

                                  {/* <p class=" text-md  text-gray-500 ">Business</p> */}
                                  <p class=" text-sm  text-gray-500 ">
                                    {userExperience.Years}
                                  </p>

                                  <p class=" text-md  text-black ">
                                    {userExperience.Description}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {openModalID === userExperience.id ? (
                              <Modal
                                isOpen={isOpen}
                                onClose={onClose}
                                size="xl"
                                key={userExperience.id}
                              >
                                <ModalOverlay />
                                <ModalContent>
                                  <div
                                    id="hs-pro-dasadpm"
                                    class=" size-full fixed top-0 start-0 z-[80]  overflow-y-auto pointer-events-none [--close-when-click-inside:true] "
                                  >
                                    <div class="mt-7 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                                      <div class="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] ">
                                        <div class="py-3 px-4 flex justify-between items-center border-b ">
                                          <h3 class="font-semibold text-gray-800 ">
                                            Experience
                                          </h3>
                                          <button
                                            type="button"
                                            onClick={() => onClose()}
                                            class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                            data-hs-overlay="#hs-pro-dasadpm"
                                          >
                                            <span class="sr-only">Close</span>
                                            <svg
                                              class="flex-shrink-0 size-4"
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="24"
                                              height="24"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              stroke-width="2"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            >
                                              <path d="M18 6 6 18" />
                                              <path d="m6 6 12 12" />
                                            </svg>
                                          </button>
                                        </div>

                                        <form>
                                          <div class="p-4 space-y-5">
                                            <div>
                                              <label
                                                for="hs-pro-dalpn"
                                                class="block mb-2 text-sm font-medium text-gray-800 "
                                              >
                                                Title
                                              </label>

                                              <input
                                                type="text"
                                                defaultValue={
                                                  userExperience.Title
                                                }
                                                onChange={(e) =>
                                                  setExperienceTitle1(
                                                    e.target.value
                                                  )
                                                }
                                                class="py-2.5 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                                placeholder="ex: Landscaping"
                                              />
                                            </div>
                                            <div>
                                              <label
                                                for="hs-pro-dalpn"
                                                class="block mb-2 text-sm font-medium text-gray-800 "
                                              >
                                                Length
                                              </label>

                                              <input
                                                type="text"
                                                defaultValue={
                                                  userExperience.Years
                                                }
                                                onChange={(e) =>
                                                  setExperienceYears(
                                                    e.target.value
                                                  )
                                                }
                                                class="py-2.5 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                                placeholder="ex: 2 years"
                                              />
                                            </div>
                                            <div>
                                              <label
                                                for="hs-pro-dalpn"
                                                class="block mb-2 text-sm font-medium text-gray-800 "
                                              >
                                                Description
                                              </label>

                                              <textarea
                                                type="text"
                                                defaultValue={
                                                  userExperience.Description
                                                }
                                                onChange={(e) =>
                                                  setExperienceDescription(
                                                    e.target.value
                                                  )
                                                }
                                                idrows="5"
                                                class="  sm:p-5 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                                placeholder="ex: I am a dedicated landscaper with over 10 years of experience in the field."
                                              />
                                            </div>
                                          </div>

                                          <div class="p-4 flex justify-end gap-x-2">
                                            <div class="w-full flex justify-end items-center gap-x-2">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleDeleteExperience(
                                                    userExperience.Title
                                                  )
                                                }
                                                class="py-2 px-3  inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 "
                                                data-hs-overlay="#hs-pro-dasadpm"
                                              >
                                                Delete
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  updateUserExperience(
                                                    userExperience
                                                  )
                                                }
                                                class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                                data-hs-overlay="#hs-pro-dasadpm"
                                              >
                                                Save
                                              </button>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </ModalContent>
                              </Modal>
                            ) : null}
                          </>
                        ))
                      ) : ( null
                        // <div class="p-5 min-h-[328px] flex flex-col justify-center items-center text-center">
                        //   <svg
                        //     class="w-48 mx-auto mb-4"
                        //     width="178"
                        //     height="90"
                        //     viewBox="0 0 178 90"
                        //     fill="none"
                        //     xmlns="http://www.w3.org/2000/svg"
                        //   >
                        //     <rect
                        //       x="27"
                        //       y="50.5"
                        //       width="124"
                        //       height="39"
                        //       rx="7.5"
                        //       fill="currentColor"
                        //       class="fill-white "
                        //     />
                        //     <rect
                        //       x="27"
                        //       y="50.5"
                        //       width="124"
                        //       height="39"
                        //       rx="7.5"
                        //       stroke="currentColor"
                        //       class="stroke-gray-50 "
                        //     />
                        //     <rect
                        //       x="34.5"
                        //       y="58"
                        //       width="24"
                        //       height="24"
                        //       rx="4"
                        //       fill="currentColor"
                        //       class="fill-gray-50 "
                        //     />
                        //     <rect
                        //       x="66.5"
                        //       y="61"
                        //       width="60"
                        //       height="6"
                        //       rx="3"
                        //       fill="currentColor"
                        //       class="fill-gray-50 "
                        //     />
                        //     <rect
                        //       x="66.5"
                        //       y="73"
                        //       width="77"
                        //       height="6"
                        //       rx="3"
                        //       fill="currentColor"
                        //       class="fill-gray-50 "
                        //     />
                        //     <rect
                        //       x="19.5"
                        //       y="28.5"
                        //       width="139"
                        //       height="39"
                        //       rx="7.5"
                        //       fill="currentColor"
                        //       class="fill-white "
                        //     />
                        //     <rect
                        //       x="19.5"
                        //       y="28.5"
                        //       width="139"
                        //       height="39"
                        //       rx="7.5"
                        //       stroke="currentColor"
                        //       class="stroke-gray-100 "
                        //     />
                        //     <rect
                        //       x="27"
                        //       y="36"
                        //       width="24"
                        //       height="24"
                        //       rx="4"
                        //       fill="currentColor"
                        //       class="fill-gray-100 "
                        //     />
                        //     <rect
                        //       x="59"
                        //       y="39"
                        //       width="60"
                        //       height="6"
                        //       rx="3"
                        //       fill="currentColor"
                        //       class="fill-gray-100 "
                        //     />
                        //     <rect
                        //       x="59"
                        //       y="51"
                        //       width="92"
                        //       height="6"
                        //       rx="3"
                        //       fill="currentColor"
                        //       class="fill-gray-100 "
                        //     />
                        //     <g filter="url(#filter13)">
                        //       <rect
                        //         x="12"
                        //         y="6"
                        //         width="154"
                        //         height="40"
                        //         rx="8"
                        //         fill="currentColor"
                        //         class="fill-white "
                        //         shape-rendering="crispEdges"
                        //       />
                        //       <rect
                        //         x="12.5"
                        //         y="6.5"
                        //         width="153"
                        //         height="39"
                        //         rx="7.5"
                        //         stroke="currentColor"
                        //         class="stroke-gray-100 "
                        //         shape-rendering="crispEdges"
                        //       />
                        //       <rect
                        //         x="20"
                        //         y="14"
                        //         width="24"
                        //         height="24"
                        //         rx="4"
                        //         fill="currentColor"
                        //         class="fill-gray-200  "
                        //       />
                        //       <rect
                        //         x="52"
                        //         y="17"
                        //         width="60"
                        //         height="6"
                        //         rx="3"
                        //         fill="currentColor"
                        //         class="fill-gray-200 "
                        //       />
                        //       <rect
                        //         x="52"
                        //         y="29"
                        //         width="106"
                        //         height="6"
                        //         rx="3"
                        //         fill="currentColor"
                        //         class="fill-gray-200 "
                        //       />
                        //     </g>
                        //     <defs>
                        //       <filter
                        //         id="filter13"
                        //         x="0"
                        //         y="0"
                        //         width="178"
                        //         height="64"
                        //         filterUnits="userSpaceOnUse"
                        //         color-interpolation-filters="sRGB"
                        //       >
                        //         <feFlood
                        //           flood-opacity="0"
                        //           result="BackgroundImageFix"
                        //         />
                        //         <feColorMatrix
                        //           in="SourceAlpha"
                        //           type="matrix"
                        //           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        //           result="hardAlpha"
                        //         />
                        //         <feOffset dy="6" />
                        //         <feGaussianBlur stdDeviation="6" />
                        //         <feComposite in2="hardAlpha" operator="out" />
                        //         <feColorMatrix
                        //           type="matrix"
                        //           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
                        //         />
                        //         <feBlend
                        //           mode="normal"
                        //           in2="BackgroundImageFix"
                        //           result="effect1_dropShadow_1187_14810"
                        //         />
                        //         <feBlend
                        //           mode="normal"
                        //           in="SourceGraphic"
                        //           in2="effect1_dropShadow_1187_14810"
                        //           result="shape"
                        //         />
                        //       </filter>
                        //     </defs>
                        //   </svg>

                        //    <div class="max-w-sm mx-auto">
                        //     <p class="mt-2 font-medium text-gray-800 ">
                        //       Nothing here
                        //     </p>
                        //     <p class="mb-5 text-sm text-gray-500 "></p>
                        //   </div> 
                        //    <button
                        //     type="button"
                        //     class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none "
                        //     data-hs-overlay="#hs-pro-dasadpm"
                        //     onClick={() => onOpenAddExperience()}
                        //   >
                        //     <svg
                        //       class="hidden sm:block flex-shrink-0 size-4"
                        //       xmlns="http://www.w3.org/2000/svg"
                        //       width="24"
                        //       height="24"
                        //       viewBox="0 0 24 24"
                        //       fill="none"
                        //       stroke="currentColor"
                        //       stroke-width="2"
                        //       stroke-linecap="round"
                        //       stroke-linejoin="round"
                        //     >
                        //       <path d="M5 12h14" />
                        //       <path d="M12 5v14" />
                        //     </svg>
                        //     Add experience
                        //   </button> 
                        // </div>
                      )}

                      {(userExperienceLength < 3) &
                      (userExperienceLength !== 0) ? (
                        <div class="p-5 min-h-[80px] flex flex-col justify-end items-end text-center">
                          <button
                            type="button"
                            class="py-2 px-3 inline-flex  items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none "
                            data-hs-overlay="#hs-pro-dasadpm"
                            onClick={() => onOpenAddExperience()}
                          >
                            <svg
                              class="hidden sm:block flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M5 12h14" />
                              <path d="M12 5v14" />
                            </svg>
                            Add experience
                          </button>
                        </div>
                      ) : null}

                      <Modal
                        isOpen={isOpenAddExperience}
                        onClose={onCloseAddExperience}
                        size="xl"
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <div
                            id="hs-pro-dasadpm"
                            class=" size-full fixed top-0 start-0 z-[80]  overflow-y-auto pointer-events-none [--close-when-click-inside:true] "
                          >
                            <div class="mt-7 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                              <div class="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] ">
                                <div class="py-3 px-4 flex justify-between items-center border-b ">
                                  <h3 class="font-semibold text-gray-800 ">
                                    Experience
                                  </h3>
                                  <button
                                    type="button"
                                    onClick={() => onCloseAddExperience()}
                                    class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                    data-hs-overlay="#hs-pro-dasadpm"
                                  >
                                    <span class="sr-only">Close</span>
                                    <svg
                                      class="flex-shrink-0 size-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    >
                                      <path d="M18 6 6 18" />
                                      <path d="m6 6 12 12" />
                                    </svg>
                                  </button>
                                </div>

                                <form>
                                  <div class="p-4 space-y-5">
                                    <div>
                                      <label
                                        for="hs-pro-dalpn"
                                        class="block mb-2 text-sm font-medium text-gray-800 "
                                      >
                                        Title
                                      </label>

                                      <input
                                        type="text"
                                        placeholder="ex: Snow removal"
                                        onChange={(e) =>
                                          setAddExperienceTitle(e.target.value)
                                        }
                                        class="py-2.5 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                      />
                                    </div>
                                    <div>
                                      <label
                                        for="hs-pro-dalpn"
                                        class="block mb-2 text-sm font-medium text-gray-800 "
                                      >
                                        Length
                                      </label>

                                      <input
                                        type="text"
                                        placeholder="ex: 2 years"
                                        onChange={(e) =>
                                          setAddExperienceYears(e.target.value)
                                        }
                                        class="py-2.5 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                      />
                                    </div>
                                    <div>
                                      <label
                                        for="hs-pro-dalpn"
                                        class="block mb-2 text-sm font-medium text-gray-800 "
                                      >
                                        Description
                                      </label>

                                      <textarea
                                        type="text"
                                        placeholder="ex: I operated a plow truck for 2 years in the metro area over the past few winters."
                                        onChange={(e) =>
                                          setAddExperienceDescription(
                                            e.target.value
                                          )
                                        }
                                        rows="5"
                                        class=" sm:p-3 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                      />
                                    </div>
                                  </div>

                                  <div class="p-4 flex justify-end gap-x-2">
                                    <div class="w-full flex justify-end items-center gap-x-2">
                                      <button
                                        type="button"
                                        onClick={() => onCloseAddExperience()}
                                        class="py-2 px-3  inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 "
                                        data-hs-overlay="#hs-pro-dasadpm"
                                      >
                                        Cancel
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => addNewUserExperience()}
                                        class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                        data-hs-overlay="#hs-pro-dasadpm"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </ModalContent>
                      </Modal>

                      {/* <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                      <h2 class="inline-block font-semibold text-gray-800 ">
                        Skills
                      </h2>

                      <div class="flex sm:justify-end items-center gap-x-2">
                        
                      </div>
                    </div> */}

                      <div class="flex flex-col bg-white  rounded-xl shadow-sm xl:shadow-none ">
                        {/* <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                          <h2 class="inline-block font-semibold text-gray-800 ">
                            Projects
                          </h2>
                        </div> */}

                        <div class="space-y-2">
                          {/* <label class="block block mb-2 ml-5 text-sm font-medium text-gray-600 ">
                            Upload attachments of work you've completed.
                          </label> */}

                          {projectPictureOne ? (
                            <>
                              <div class="p-12 mx-5 mb-5 flex justify-center bg-white border border border-gray-300 rounded-xl ">
                                <button
                                  className="embla__prev"
                                  onClick={scrollPrev}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-6 h-6 mr-2"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M15.75 19.5 8.25 12l7.5-7.5"
                                    />
                                  </svg>
                                </button>
                                <div className="overflow-hidden">
                                  <div
                                    className="w-full max-w-96 "
                                    ref={emblaRef}
                                  >
                                    <div className="flex">
                                      <div className="grow-0 shrink-0  w-full h-full">
                                        <img
                                          className="w-full h-full"
                                          src={projectPictureOne}
                                        ></img>
                                      </div>
                                      {projectPictureTwo ? (
                                        <div className="grow-0 shrink-0 w-full h-full">
                                          <img
                                            className="w-full"
                                            src={projectPictureTwo}
                                          ></img>
                                        </div>
                                      ) : null}
                                      {projectPictureThree ? (
                                        <div className="grow-0 shrink-0 w-full h-full">
                                          <img
                                            className="w-full "
                                            src={projectPictureThree}
                                          ></img>
                                        </div>
                                      ) : null}
                                      {projectPictureFour ? (
                                        <div className="grow-0 shrink-0 w-full h-full">
                                          <img
                                            className="w-full "
                                            src={projectPictureFour}
                                          ></img>
                                        </div>
                                      ) : null}
                                      {projectPictureFive ? (
                                        <div className="grow-0 shrink-0 w-full h-full">
                                          <img
                                            className="w-full "
                                            src={projectPictureFive}
                                          ></img>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  className="embla__next"
                                  onClick={scrollNext}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-6 h-6 ml-2"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <div class="flex flex-col bg-white  rounded-xl shadow-sm xl:shadow-none ">
                                <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                                  <h2 class="inline-block font-semibold text-gray-800 "></h2>

                                  <div class="flex sm:justify-end justify-end items-center gap-x-2">
                                    <button
                                      type="button"
                                      onClick={() => onOpenProject()}
                                      class="py-2 px-2 inline-flex  items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none "
                                      data-hs-overlay="#hs-pro-dasadpm"
                                    >
                                      <svg
                                        class="hidden sm:block flex-shrink-0 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      >
                                        <path d="M5 12h14" />
                                        <path d="M12 5v14" />
                                      </svg>
                                      Add pictures
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : ( null
                            // <div class="p-12 mx-5 mb-5 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl ">
                            //   <div class="text-center">
                            //     <svg
                            //       class="w-16 text-gray-400 mx-auto "
                            //       width="70"
                            //       height="46"
                            //       viewBox="0 0 70 46"
                            //       fill="none"
                            //       xmlns="http://www.w3.org/2000/svg"
                            //     >
                            //       <path
                            //         d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z"
                            //         fill="currentColor"
                            //         stroke="currentColor"
                            //         stroke-width="2"
                            //         class="fill-white stroke-gray-400 "
                            //       />
                            //       <path
                            //         d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z"
                            //         fill="currentColor"
                            //         stroke="currentColor"
                            //         stroke-width="2"
                            //         class="fill-white stroke-gray-400 "
                            //       />
                            //       <rect
                            //         x="17.0656"
                            //         y="1.62305"
                            //         width="35.8689"
                            //         height="42.7541"
                            //         rx="5"
                            //         fill="currentColor"
                            //         stroke="currentColor"
                            //         stroke-width="2"
                            //         class="fill-white stroke-gray-400 "
                            //       />
                            //       <path
                            //         d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z"
                            //         stroke="currentColor"
                            //         stroke-width="2"
                            //         class="stroke-gray-400 "
                            //       />
                            //       <circle
                            //         cx="39.5902"
                            //         cy="14.9672"
                            //         r="4.16393"
                            //         stroke="currentColor"
                            //         stroke-width="2"
                            //         class="stroke-gray-400 dark:stroke-neutral-500"
                            //       />
                            //     </svg>

                            //     <div class="mt-4 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
                            //       <span class="pe-1 font-medium text-gray-800 ">
                            //         Drop your files here or
                            //       </span>
                            //       <label
                            //         for="hs-pro-upcebb"
                            //         class="relative cursor-pointer bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 "
                            //       >
                            //         <button onClick={() => onOpenProject()}>
                            //           browse
                            //         </button>
                            //         <input
                            //           id="hs-pro-upcebb"
                            //           type="file"
                            //           class="sr-only"
                            //         />
                            //       </label>
                            //     </div>

                            //     <p class="mt-1 text-xs text-gray-400 ">
                            //       JPEG, IMAGES
                            //     </p>
                            //   </div>
                            // </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isOpenProject}
          onClose={onCloseProject}
          size="xl"
          height="420px"
        >
          <ModalOverlay />
          <ModalContent>
            <div
              id="hs-pro-dasadpm"
              class=" size-full fixed top-0 start-0 z-[80]  overflow-y-auto pointer-events-none [--close-when-click-inside:true] "
            >
              <div class="mt-7 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                <div class="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] ">
                  <div class="py-3 px-4 flex justify-between items-center border-b ">
                    <h3 class="font-semibold text-gray-800 ">
                      Add a photo of your work (limit 5)
                    </h3>
                    <button
                      type="button"
                      onClick={() => onCloseProject()}
                      class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                      data-hs-overlay="#hs-pro-dasadpm"
                    >
                      <span class="sr-only">Close</span>
                      <svg
                        class="flex-shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>

                  <form>
                    <div class="p-4 space-y-5">
                      <div>
                        <div class="flex flex-wrap items-center gap-3 sm:gap-5">
                          {newProjectImage ? (
                            <img class="w-full h-full" src={newProjectImage} />
                          ) : (
                            <span class="flex flex-shrink-0 justify-center items-center size-20 border-2 border-dotted border-gray-300 text-gray-400 rounded-full dark:border-neutral-700 dark:text-neutral-600">
                              <svg
                                class="flex-shrink-0 size-7"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <rect
                                  width="18"
                                  height="18"
                                  x="3"
                                  y="3"
                                  rx="2"
                                  ry="2"
                                />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              </svg>
                            </span>
                          )}

                          <div class="grow">
                            <div class="flex items-center gap-x-2">
                              <ImageUploading
                                multiple
                                value={projectImages}
                                onChange={onChangeProject}
                                maxNumber={maxProjectNumber}
                                dataURLKey="data_url"
                              >
                                {({
                                  projectImageList,
                                  onImageUpload,
                                  onImageRemoveAll,
                                  onImageUpdate,
                                  onImageRemove,
                                  isDragging,
                                  dragProps,
                                }) => (
                                  // write your building UI
                                  <div className="upload__image-wrapper">
                                    <button
                                      type="button"
                                      onClick={() => onImageUpdate()}
                                      {...dragProps}
                                      class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" x2="12" y1="3" y2="15" />
                                      </svg>
                                      Upload photo
                                    </button>
                                    &nbsp;
                                  </div>
                                )}
                              </ImageUploading>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="p-4 flex justify-end gap-x-2">
                      <div class="w-full flex justify-end items-center gap-x-2">
                        <button
                          type="button"
                          onClick={() => onCloseProject()}
                          class="py-2 px-3  inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 "
                          data-hs-overlay="#hs-pro-dasadpm"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => uploadProjectsToFirebase()}
                          class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                          data-hs-overlay="#hs-pro-dasadpm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </main>
    </>
  );
};

export default UserProfile;
