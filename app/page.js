'use client';
import './globals.css';
import React from "react";
import { LayoutGrid } from "@/components/ui/layout-grid";
import SectionTwo from '@/components/SectionTwo';
import { GridMotionDemo } from '@/components/blocks/about-site';
import { FeatureSteps } from "@/components/blocks/feature-section"
import { RevealImageList } from '@/components/ui/reveal-images';
import { BackgroundPaths } from '@/components/ui/background-paths';

const SkeletonOne = () => {
  return (
    <div className="p-4">
      <p className="font-bold md:text-4xl text-xl text-white">
        House in the woods
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A serene and tranquil retreat, this house in the woods offers a peaceful
        escape from the hustle and bustle of city life.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div className="p-4">
      <p className="font-bold md:text-4xl text-xl text-white">
        House above the clouds
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Perched high above the world, this house offers breathtaking views and a
        unique living experience. It&apos;s a place where the sky meets home,
        and tranquility is a way of life.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div className="p-4">
      <p className="font-bold md:text-4xl text-xl text-white">
        Greens all over
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A house surrounded by greenery and nature&apos;s beauty. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div className="p-4">
      <p className="font-bold md:text-4xl text-xl text-white">
        Rivers are serene
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A house by the river is a place of peace and tranquility. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const features = [
  { 
    step: 'Malerium 1', 
    title: 'Discover My Journey',
    content: 'Explore my creative world through photography, design, and storytelling.', 
    image: 'https://images.pexels.com/photos/442573/pexels-photo-442573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
  },
  { 
    step: 'Malerium 2',
    title: 'Dive Into Creativity',
    content: 'Get an inside look at my artistic process and the inspirations behind my work.',
    image: 'https://images.pexels.com/photos/1830937/pexels-photo-1830937.jpeg'
  },
  { 
    step: 'Malerium 3',
    title: 'Join the Experience',
    content: 'Follow along as I capture moments, explore new ideas, and bring visions to life.',
    image: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

export default function Home() {
  return (
    <div className="max-w-full overflow-x-hidden">
      <BackgroundPaths title="Thats your Malerium Gallery" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <RevealImageList />
          
          <div className="w-full max-w-7xl mx-auto py-10">
            <LayoutGrid cards={cards} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <GridMotionDemo/>
        
        <FeatureSteps 
          features={features}
          title="Malerium Journey starts here!"
          autoPlayInterval={3000}
          imageHeight="h-[500px]"
        />
        
        <SectionTwo/>
      </div>
    </div>
  );
}