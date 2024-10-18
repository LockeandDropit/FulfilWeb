import React from "react";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
const ResumeDashboard = () => {
  return (
    <div>
      <Header />
      <Dashboard />

      <main id="content" class="lg:ps-[260px] pt-[59px]">
        <div class="max-w-6xl mx-auto ">
          <header className="mt-20">
            <h1 className="text-xl font-semibold">My Resumes</h1>
          </header>
          <div className="mt-40 flex space-x-6">
            <p>Add Resume</p>
            {/* onclick, this will open a modal that will require the user to name their resume before starting... or I could just create a uid for it...? or both Idk. */}
            <p>previous resume</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeDashboard;
