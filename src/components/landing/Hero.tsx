"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 translate-y-[-10%] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(var(--primary-rgb),0.05),transparent)] opacity-50 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium transition-all hover:bg-secondary/80">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
                NextGen School Management
              </Badge>
            </div>
            
            <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Revolutionize School Management with{" "}
              <span className="bg-linear-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                Intelligent Automation
              </span>
            </h1>
            
            <p className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 mt-6 max-w-lg text-lg text-muted-foreground sm:text-xl">
              Streamline academics, administration, and communication. Empower teachers, engage parents, and inspire students with our all-in-one platform.
            </p>
            
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold transition-all hover:bg-accent hover:text-accent-foreground active:scale-95">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Social Proof / Stats */}
            <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400 mt-12 grid grid-cols-3 gap-8 border-t pt-8">
              <div>
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Schools Joined</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">50k+</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">99%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
          
          {/* Right Column: Visual */}
          <div className="animate-in fade-in zoom-in duration-1000 delay-200 relative lg:ml-auto">
            <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-2xl bg-linear-to-tr from-indigo-50 to-teal-50 p-4 shadow-2xl lg:max-w-none">
              <div className="absolute inset-0 bg-primary/5 p-4 rounded-2xl border border-primary/10" />
              <Image
                src="/images/hero_illustration.png"
                alt="School Management System Illustration"
                width={800}
                height={800}
                priority
                className="h-full w-full object-contain transition-transform duration-700 hover:scale-110"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 h-24 w-24 animate-pulse rounded-full bg-orange-400/10 blur-xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 animate-bounce-slow rounded-full bg-indigo-400/10 blur-xl" />
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
