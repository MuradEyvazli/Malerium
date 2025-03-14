import React from 'react'
import { Feature } from "@/components/ui/feature-with-image-comparison";
import { AnimatedTooltipPreview } from './DemoProfile';

const SectionTwo = () => {
  return (
    <div className="w-full">
      <Feature/>
      <AnimatedTooltipPreview/>
    </div>
  )
}

export default SectionTwo