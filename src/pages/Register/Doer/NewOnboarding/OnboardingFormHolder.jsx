import React from 'react'
import DoerHeader from '../../../Doer/components/DoerHeader'
import { useLocation } from "react-router-dom";
import CurrentIncome from './CurrentIncome';



const OnboardingFormHolder = () => {
  return (
    <div><DoerHeader />
    <CurrentIncome />
    
    
    
    </div>
  )
}

export default OnboardingFormHolder