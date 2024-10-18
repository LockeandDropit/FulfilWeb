import React from "react";

const AboutHero = () => {
  // https://stackoverflow.com/questions/70805041/background-image-in-tailwindcss-using-dynamic-url-react-js
//   const bag2 =
//     "/landingImages/horizontal-portrait-people-sit-queue-have-pleasant-conversation-with-each-other.jpg";

  return (
    <>
        <div class=" px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  <div class="flex min-h-[35vh] md:min-h-[75vh] bg-[url('https://img.freepik.com/free-photo/horizontal-portrait-people-sit-queue-have-pleasant-conversation-with-each-other_273609-8261.jpg?t=st=1729287003~exp=1729290603~hmac=78654d858e736b6b44a83431e9c87c15747527a5bf6842762eef42453f389be2&w=1380')] bg-center bg-cover bg-no-repeat  rounded-xl">
    <div class="ml-auto mt-auto w-1/2  text-center  p-6  md:text-start md:mx-0 opacity-90">
   
      <div class="px-5 py-4  bg-white rounded-lg md:p-7 ">
       
          <h3 class="text-lg font-bold text-gray-800 sm:text-2xl ">About us</h3>
          <p className="mt-4 text-lg text-black">
                At Fulfil, we believe everyone deserves the opportunity to build
                a rewarding career, regardless of their educational background.
                We're here to guide you on your journey to professional success.
              </p>
              <p className="mt-2 text-lg text-black">
                Fulfil's mission is to help everyone achieve their highest
                potential by providing access to abundant opportunities and the
                tools to pursue them. Whether you're just starting out or
                seeking a new direction, Fulfil offers a clear path to gainful
                employment for those considering careers that do not require
                four-year degrees.
              </p>


      </div>
    
    </div>
  </div>
</div>
      {/* <div className="flex w-full h-dvh">
        <div
          className="min-h-[35vh] md:min-h-[75vh] rounded-md flex p-6"
          style={{ backgroundImage: `url(${bag2})`, backgroundSize: "contain" }}
        >
          <div className="bg-white rounded-md w-1/2 h-2/5  ml-auto mt-auto  opacity-90">
            <div className=" p-4 w-4/5 h-4/5 align-center  mx-auto">
              <p className="text-4xl font-semibold text-black">About us</p>
              <p className="mt-4 text-lg text-black">
                At Fulfil, we believe everyone deserves the opportunity to build
                a rewarding career, regardless of their educational background.
                We're here to guide you on your journey to professional success.
              </p>
              <p className="mt-2 text-lg text-black">
                Fulfil's mission is to help everyone achieve their highest
                potential by providing access to abundant opportunities and the
                tools to pursue them. Whether you're just starting out or
                seeking a new direction, Fulfil offers a clear path to gainful
                employment for those considering careers that do not require
                four-year degrees
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default AboutHero;
