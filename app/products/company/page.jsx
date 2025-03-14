import InteractiveBentoGallery from '@/components/blocks/interactive-bento-gallery'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import React from 'react'

const page = () => {
  const mediaItems = [
    {
      id: 1,
      type: "image",
      title: "Anurag Mishra",
      desc: "Driven, innovative, visionary",
      url: "https://kxptt4m9j4.ufs.sh/f/9YHhEDeslzkcbP3rYTiXwH7Y106CepJOsoAgQjyFi3MUfDkh",
      span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
    },
    {
      id: 2,
      type: "video",
      title: "Dog Puppy",
      desc: "Adorable loyal companion.",
      url: "https://cdn.pixabay.com/video/2024/07/24/222837_large.mp4",
      span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
    },
    {
      id: 3,
      type: "image",
      title: "Forest Path",
      desc: "Mystical forest trail",
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2 ",
    },
    {
      id: 4,
      type: "image",
      title: "Falling Leaves",
      desc: "Autumn scenery",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
    },
    {
      id: 5,
      type: "video",
      title: "Bird Parrot",
      desc: "Vibrant feathered charm",
      url: "https://cdn.pixabay.com/video/2020/07/30/46026-447087782_large.mp4",
      span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
    },
    {
      id: 6,
      type: "image",
      title: "Beach Paradise",
      desc: "Sunny tropical beach",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
    },
    {
      id: 7,
      type: "video",
      title: "Shiva Temple",
      desc: "Peaceful Shiva sanctuary.",
      url: "https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4",
      span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
    },
  ]
  
  return (
    <div>
    <BackgroundBeamsWithCollision>
      <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
        What&apos;s your appinion about Malerium?{" "}
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="">Just watch our mockups !</span>
          </div>
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span className="">Just watch our mockups !</span>
          </div>
        </div>
      </h2>
    </BackgroundBeamsWithCollision>
    <div className="min-h-screen overflow-y-auto">
    <InteractiveBentoGallery
      mediaItems={mediaItems}
      title="Gallery Shots Collection"
      description="Drag and explore our curated collection of shots"
    />
    <InteractiveBentoGallery
      mediaItems={mediaItems}
      
    />
  </div>
  </div>
  )
}

export default page