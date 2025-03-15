"use client";

import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import FindColor from '@/components/FindColor'

const ColorWheelPage = () => {

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div>
        <FindColor/>
      </div>
    </div>
  );
};

export default ColorWheelPage;
