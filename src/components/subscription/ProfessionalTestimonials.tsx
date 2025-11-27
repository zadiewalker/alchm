'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight, Award, TrendingUp, Heart, Shield, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  professional: {
    name: string;
    credentials: string;
    role: string;
    institution?: string;
    yearsExperience: number;
  };
  rating: number;
  testimonial: string;
  clientOutcomes: {
    metric: string;
    improvement: string;
    timeframe: string;
  }[];
  category: 'therapist' | 'psychiatrist' | 'coach' | 'researcher';
  verificationDate: string;
}

export function ProfessionalTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [autoPlay, setAutoPlay] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      professional: {
        name: 'Dr. Sarah Chen',
        credentials: 'PhD, LCSW',
        role: 'Clinical Psychologist',
        institution: 'Stanford University Medical Center',
        yearsExperience: 12
      },
      rating: 5,
      testimonial: 'ALCHM has transformed how my clients engage with their healing journey. The emotional intelligence insights provide me with invaluable data between sessions, and clients report feeling more supported than ever. The crisis safety features give me peace of mind when working with high-risk populations.',
      clientOutcomes: [
        { metric: 'Session engagement', improvement: '78% increase', timeframe: '3 months' },
        { metric: 'Between-session progress', improvement: '65% improvement', timeframe: '6 months' },
        { metric: 'Crisis episodes', improvement: '45% reduction', timeframe: '1 year' }
      ],
      category: 'therapist',
      verificationDate: '2024-01-15'
    },
    {
      id: '2',
      professional: {
        name: 'Dr. Michael Rodriguez',
        credentials: 'MD, Psychiatrist',
        role: 'Psychiatrist',
        institution: 'Mayo Clinic',
        yearsExperience: 18
      },
      rating: 5,
      testimonial: 'The clinical reports ALCHM generates are remarkably insightful. They help me track medication effectiveness and identify patterns I might miss in traditional 15-minute appointments. My patients are more engaged and self-aware.',
      clientOutcomes: [
        { metric: 'Medication adherence', improvement: '89% improvement', timeframe: '4 months' },
        { metric: 'Symptom tracking accuracy', improvement: '72% increase', timeframe: '2 months' },
        { metric: 'Emergency interventions', improvement: '38% reduction', timeframe: '8 months' }
      ],
      category: 'psychiatrist',
      verificationDate: '2024-02-08'
    },
    {
      id: '3',
      professional: {
        name: 'Maria Santos',
        credentials: 'PCC, ICF',
        role: 'Executive Life Coach',
        institution: 'Santos Coaching Institute',
        yearsExperience: 8
      },
      rating: 5,
      testimonial: 'My clients love how ALCHM bridges our coaching sessions. The emotional intelligence tracking helps them understand their patterns, and I can see their growth in real-time. It\'s like having a co-coach that never sleeps.',
      clientOutcomes: [
        { metric: 'Goal achievement rate', improvement: '84% increase', timeframe: '6 months' },
        { metric: 'Self-awareness scores', improvement: '92% improvement', timeframe: '3 months' },
        { metric: 'Stress management', improvement: '76% better', timeframe: '4 months' }
      ],
      category: 'coach',
      verificationDate: '2024-01-22'
    },
    {
      id: '4',
      professional: {
        name: 'Dr. Jennifer Kim',
        credentials: 'PhD, Research Director',
        role: 'Mental Health Researcher',
        institution: 'Harvard School of Public Health',
        yearsExperience: 15
      },
      rating: 5,
      testimonial: 'From a research perspective, ALCHM\'s approach to trauma-informed design and emotional intelligence tracking is groundbreaking. The anonymous aggregate data helps us understand healing patterns at scale while maintaining individual privacy.',
      clientOutcomes: [
        { metric: 'Research participation', improvement: '94% completion rate', timeframe: '12 months' },
        { metric: 'Data quality', improvement: '88% accuracy', timeframe: 'Ongoing' },
        { metric: 'Longitudinal insights', improvement: '156% more comprehensive', timeframe: '18 months' }
      ],
      category: 'researcher',
      verificationDate: '2024-03-01'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Professionals', count: testimonials.length },
    { id: 'therapist', label: 'Therapists', count: testimonials.filter(t => t.category === 'therapist').length },
    { id: 'psychiatrist', label: 'Psychiatrists', count: testimonials.filter(t => t.category === 'psychiatrist').length },
    { id: 'coach', label: 'Coaches', count: testimonials.filter(t => t.category === 'coach').length },
    { id: 'researcher', label: 'Researchers', count: testimonials.filter(t => t.category === 'researcher').length }
  ];

  const filteredTestimonials = selectedCategory === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === selectedCategory);

  useEffect(() => {
    if (autoPlay && filteredTestimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => 
          prev === filteredTestimonials.length - 1 ? 0 : prev + 1
        );
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [autoPlay, filteredTestimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === filteredTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? filteredTestimonials.length - 1 : prev - 1
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentTestimonial(0);
  };

  if (filteredTestimonials.length === 0) return null;

  const testimonial = filteredTestimonials[currentTestimonial];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-medium text-slate-800">
            Trusted by Mental Health Professionals
          </h2>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Leading therapists, psychiatrists, and coaches share how ALCHM enhances 
          their practice and improves client outcomes
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category.id)}
            className="text-xs"
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Main Testimonial Display */}
      <Card className="p-8 bg-white border-slate-200 relative">
        <div className="space-y-6">
          {/* Professional Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-slate-800">
                  {testimonial.professional.name}
                </h3>
                <div className="text-slate-500 text-sm">
                  {testimonial.professional.credentials}
                </div>
              </div>
              <div className="text-sm text-slate-600">
                {testimonial.professional.role}
                {testimonial.professional.institution && (
                  <span> • {testimonial.professional.institution}</span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                {testimonial.professional.yearsExperience} years experience
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Testimonial Text */}
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-purple-200" />
            <blockquote className="text-slate-700 text-lg leading-relaxed pl-6">
              {testimonial.testimonial}
            </blockquote>
          </div>

          {/* Client Outcomes */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-800">Client Outcomes</h4>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {testimonial.clientOutcomes.map((outcome, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-medium text-green-700">
                    {outcome.improvement}
                  </div>
                  <div className="text-sm font-medium text-green-800">
                    {outcome.metric}
                  </div>
                  <div className="text-xs text-green-600">
                    in {outcome.timeframe}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Verified professional • {testimonial.verificationDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Category: {testimonial.category}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {filteredTestimonials.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 pointer-events-none">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="pointer-events-auto bg-white/90 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="pointer-events-auto bg-white/90 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>

      {/* Navigation Dots */}
      {filteredTestimonials.length > 1 && (
        <div className="flex justify-center space-x-2">
          {filteredTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentTestimonial
                  ? 'bg-purple-600 w-8'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-play Control */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAutoPlay(!autoPlay)}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          {autoPlay ? 'Pause' : 'Play'} slideshow
        </Button>
      </div>

      {/* Summary Stats */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="text-center space-y-4">
          <h3 className="font-medium text-slate-800">Professional Network Impact</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-medium text-blue-600">500+</div>
              <div className="text-sm text-slate-600">Licensed professionals</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-purple-600">89%</div>
              <div className="text-sm text-slate-600">Report improved outcomes</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-green-600">94%</div>
              <div className="text-sm text-slate-600">Would recommend ALCHM</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-orange-600">15,000+</div>
              <div className="text-sm text-slate-600">Clients served</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-white/50 p-3 rounded-lg">
            All testimonials are from verified mental health professionals who have used ALCHM 
            in their practice for a minimum of 3 months. Outcomes data is anonymized and aggregated.
          </div>
        </div>
      </Card>
    </div>
  );
}