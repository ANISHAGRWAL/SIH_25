"use client";

import React, { useState } from 'react';

// Types
interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface SelectedDate {
  day: number;
  dateKey: string;
  fullDate: Date;
}

interface DiaryEntries {
  [key: string]: string;
}

// Mock GradientButton component to match your design
const GradientButton: React.FC<GradientButtonProps> = ({ children, onClick, className = "" }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${className}`}
  >
    {children}
  </button>
);

export default function MindLogPage() {
  const [currentView, setCurrentView] = useState<'calendar' | 'diary' | 'report'>('calendar');
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntries>({});
  const [currentEntry, setCurrentEntry] = useState<string>('');
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0); // 0 = current week, -1 = previous week, etc.

  // Helper function to generate date key
  const getDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  // Get start of week (Sunday) for any date
  const getStartOfWeek = (date: Date): Date => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  // Generate array of dates for a specific week
  const getWeekDays = (weekOffset: number = 0): Date[] => {
    const today = new Date();
    const currentWeekStart = getStartOfWeek(today);
    
    // Calculate the target week
    const targetWeekStart = new Date(currentWeekStart);
    targetWeekStart.setDate(currentWeekStart.getDate() + (weekOffset * 7));
    
    const weekDays: Date[] = [];
    
    // Generate all 7 days of the week
    for (let i = 0; i < 7; i++) {
      const day = new Date(targetWeekStart);
      day.setDate(targetWeekStart.getDate() + i);
      weekDays.push(day);
    }
    
    return weekDays;
  };

  // Get week date range string
  const getWeekDateRange = (weekOffset: number = 0): string => {
    const weekDays = getWeekDays(weekOffset);
    const startDate = weekDays[0];
    const endDate = weekDays[6];
    
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = startDate.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  };

  // Check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Check if a date is in the current week
  const isCurrentWeek = (): boolean => {
    return currentWeekOffset === 0;
  };

  const weekDays = getWeekDays(currentWeekOffset);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (date: Date) => {
    const dateKey = getDateKey(date);
    setSelectedDate({ 
      day: date.getDate(), 
      dateKey,
      fullDate: date
    });
    setCurrentEntry(diaryEntries[dateKey] || '');
    setCurrentView('diary');
  };

  const handleSaveEntry = () => {
    if (selectedDate && currentEntry.trim()) {
      setDiaryEntries(prev => ({
        ...prev,
        [selectedDate.dateKey]: currentEntry
      }));
    }
    setCurrentView('calendar');
  };

  const handleBackToCalendar = () => {
    setCurrentView('calendar');
    setSelectedDate(null);
    setCurrentEntry('');
  };

  const handlePreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  const handleCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  const handleViewWeeklyReport = () => {
    setCurrentView('report');
  };

  const getFormattedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate weekly statistics
  const currentWeekEntries = weekDays.filter(date => diaryEntries[getDateKey(date)]).length;
  const weeklyGoalPercentage = Math.round((currentWeekEntries / 7) * 100);
  const totalEntries = Object.keys(diaryEntries).length;

  // Weekly Report View
  if (currentView === 'report') {
    const weeklyEntries = weekDays.map(date => ({
      date,
      entry: diaryEntries[getDateKey(date)] || null,
      hasEntry: !!diaryEntries[getDateKey(date)]
    }));

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBackToCalendar}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Calendar
          </button>
          <h2 className="text-xl md:text-2xl font-semibold">Weekly Report</h2>
          <div></div>
        </div>

        {/* Report Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-indigo-200/50">
          {/* Report Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-6 py-2 rounded-full font-medium shadow-lg">
              Week of {getWeekDateRange(currentWeekOffset)}
            </div>
          </div>

          {/* Weekly Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{currentWeekEntries}</div>
                <div className="text-slate-600">Entries Written</div>
              </div>
            </div>
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{weeklyGoalPercentage}%</div>
                <div className="text-slate-600">Goal Completed</div>
              </div>
            </div>
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">{7 - currentWeekEntries}</div>
                <div className="text-slate-600">Days Remaining</div>
              </div>
            </div>
          </div>

          {/* Daily Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Overview</h3>
            {weeklyEntries.map(({ date, entry, hasEntry }, index) => (
              <div key={index} className="bg-white/80 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${hasEntry ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="font-medium text-slate-700">
                      {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                    {isToday(date) && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Today</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500">
                    {hasEntry ? 'Entry written ✓' : 'No entry'}
                  </div>
                </div>
                {hasEntry && entry && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {entry.length > 100 ? `${entry.substring(0, 100)}...` : entry}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Diary View
  if (currentView === 'diary') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBackToCalendar}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Calendar
          </button>
          <h2 className="text-xl md:text-2xl font-semibold">My Diary</h2>
          <div></div>
        </div>

        {/* Diary Interface */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-xl border border-orange-200/50">
          {/* Diary Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-2 rounded-full font-medium shadow-lg">
              {selectedDate && getFormattedDate(selectedDate.fullDate)}
            </div>
          </div>

          {/* Diary Paper Effect */}
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 min-h-[500px] relative"
            style={{
              backgroundImage: `repeating-linear-gradient(
                transparent,
                transparent 31px,
                #e5e7eb 31px,
                #e5e7eb 32px
              )`,
              backgroundSize: '100% 32px'
            }}
          >
            {/* Red margin line */}
            <div className="absolute left-16 top-0 bottom-0 w-px bg-red-300"></div>
            
            {/* Holes for ring binding */}
            <div className="absolute left-6 top-12 w-4 h-4 bg-gray-200 rounded-full shadow-inner"></div>
            <div className="absolute left-6 top-32 w-4 h-4 bg-gray-200 rounded-full shadow-inner"></div>
            <div className="absolute left-6 top-52 w-4 h-4 bg-gray-200 rounded-full shadow-inner"></div>

            {/* Dear Diary Header */}
            <div className="ml-12 mb-8">
              <h3 className="text-2xl font-bold text-slate-700">Dear Diary,</h3>
            </div>

            {/* Writing Area */}
            <textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="How was your day? What are you feeling? Share your thoughts..."
              className="w-full h-80 ml-12 pr-8 bg-transparent border-none outline-none resize-none text-slate-700 text-lg leading-8 placeholder-slate-400"
              style={{ 
                fontFamily: 'serif',
                lineHeight: '32px'
              }}
            />

            {/* Signature area */}
            <div className="ml-12 mt-8 text-right pr-8">
              <p className="text-slate-500 italic">With love,</p>
              <p className="text-slate-700 font-semibold text-lg mt-2">Your Future Self 💙</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-8">
            <GradientButton 
              onClick={handleSaveEntry}
              className="px-8 py-3 text-lg"
            >
              Save My Thoughts
            </GradientButton>
          </div>
        </div>
      </div>
    );
  }

  // Main Calendar View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold">Weekly Mind Log</h2>
        <div className="text-sm text-slate-600">
          Click on any day to write in your diary
        </div>
      </div>
      
      {/* Weekly Calendar */}
      <section className="rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-slate-200 p-6 shadow-xl">
        {/* Week Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePreviousWeek}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                {getWeekDateRange(currentWeekOffset)}
              </h3>
              {!isCurrentWeek() && (
                <button 
                  onClick={handleCurrentWeek}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                >
                  Go to current week
                </button>
              )}
            </div>
            
            <button 
              onClick={handleNextWeek}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <GradientButton onClick={handleViewWeeklyReport}>
            View Weekly Report
          </GradientButton>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-3 mb-4">
          {days.map((day) => (
            <div key={day} className="text-center font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((date, index) => {
            const dateKey = getDateKey(date);
            const hasEntry = !!diaryEntries[dateKey];
            const isDateToday = isToday(date);
            
            return (
              <div key={index} className="aspect-square">
                <button
                  onClick={() => handleDayClick(date)}
                  className={`w-full h-full rounded-xl flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 group relative ${
                    isDateToday
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-400 text-white shadow-lg'
                      : hasEntry
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md hover:shadow-lg'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300'
                  }`}
                >
                  <span className="font-semibold text-lg">{date.getDate()}</span>
                  <span className="text-xs opacity-80 mt-1">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  {hasEntry && (
                    <div className="absolute bottom-2 w-2 h-2 rounded-full bg-white/80"></div>
                  )}
                  {isDateToday && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-400"></div>
            <span className="text-slate-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-emerald-500"></div>
            <span className="text-slate-600">Entry Written</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-100 ring-1 ring-slate-200"></div>
            <span className="text-slate-600">Available</span>
          </div>
        </div>
      </section>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-slate-200 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{currentWeekEntries}</p>
              <p className="text-slate-600 text-sm">This Week</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-slate-200 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{weeklyGoalPercentage}%</p>
              <p className="text-slate-600 text-sm">Weekly Goal</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-slate-200 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalEntries}</p>
              <p className="text-slate-600 text-sm">Total Entries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}