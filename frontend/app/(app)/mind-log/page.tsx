"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

interface DailyData {
  day: string;
  date: string;
  moodDisturbance: number;
  sleepDisruption: number;
  appetiteIssues: number;
  academicDisengagement: number;
  socialWithdrawal: number;
  average: number;
}

interface PieChartItem {
  label: string;
  value: number;
  color: string;
}

interface PieChartsData {
  moodDisturbance: PieChartItem[];
  sleepDisruption: PieChartItem[];
  appetiteIssues: PieChartItem[];
  academicDisengagement: PieChartItem[];
  socialWithdrawal: PieChartItem[];
}

// Mock GradientButton component
const GradientButton: React.FC<GradientButtonProps> = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base ${className}`}
  >
    {children}
  </button>
);

export default function MindLogPage() {
  const [currentView, setCurrentView] = useState<'calendar' | 'diary' | 'report'>('calendar');
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntries>({});
  const [currentEntry, setCurrentEntry] = useState<string>('');
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [selectedMetric, setSelectedMetric] = useState<string>('average');

  // Sample data - replace with your backend API calls
  const weeklyData: DailyData[] = [
    { day: "Mon", date: "2025-09-01", moodDisturbance: 9.4, sleepDisruption: 6.9, appetiteIssues: 6.0, academicDisengagement: 8.3, socialWithdrawal: 8.6, average: 7.8 },
    { day: "Tue", date: "2025-09-02", moodDisturbance: 7.2, sleepDisruption: 5.8, appetiteIssues: 4.5, academicDisengagement: 6.7, socialWithdrawal: 7.1, average: 6.3 },
    { day: "Wed", date: "2025-09-03", moodDisturbance: 8.1, sleepDisruption: 7.3, appetiteIssues: 5.9, academicDisengagement: 7.8, socialWithdrawal: 6.9, average: 7.2 },
    { day: "Thu", date: "2025-09-04", moodDisturbance: 6.8, sleepDisruption: 4.9, appetiteIssues: 3.8, academicDisengagement: 5.9, socialWithdrawal: 5.2, average: 5.3 },
    { day: "Fri", date: "2025-09-05", moodDisturbance: 8.9, sleepDisruption: 8.1, appetiteIssues: 7.2, academicDisengagement: 8.7, socialWithdrawal: 8.3, average: 8.2 },
    { day: "Sat", date: "2025-09-06", moodDisturbance: 5.4, sleepDisruption: 3.7, appetiteIssues: 2.9, academicDisengagement: 4.2, socialWithdrawal: 4.8, average: 4.2 },
    { day: "Sun", date: "2025-09-07", moodDisturbance: 7.6, sleepDisruption: 6.4, appetiteIssues: 5.7, academicDisengagement: 7.1, socialWithdrawal: 6.9, average: 6.7 }
  ];

  const pieChartsData: PieChartsData = {
    moodDisturbance: [{ label: "Mood Disturbance", value: 7.8, color: "#ef4444" }],
    sleepDisruption: [{ label: "Sleep Disruption", value: 6.2, color: "#3b82f6" }],
    appetiteIssues: [{ label: "Appetite Issues", value: 5.1, color: "#f59e0b" }],
    academicDisengagement: [{ label: "Academic Disengagement", value: 7.0, color: "#8b5cf6" }],
    socialWithdrawal: [{ label: "Social Withdrawal", value: 6.8, color: "#10b981" }]
  };

  // Helper functions (keeping existing ones)
  const getDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const getStartOfWeek = (date: Date): Date => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  const getWeekDays = (weekOffset: number = 0): Date[] => {
    const today = new Date();
    const currentWeekStart = getStartOfWeek(today);
    const targetWeekStart = new Date(currentWeekStart);
    targetWeekStart.setDate(currentWeekStart.getDate() + (weekOffset * 7));
    
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(targetWeekStart);
      day.setDate(targetWeekStart.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

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

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

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

  const getMetricLabel = (metric: string) => {
    const labels: { [key: string]: string } = {
      average: 'Overall Wellbeing',
      moodDisturbance: 'Mood Disturbance',
      sleepDisruption: 'Sleep Disruption',
      appetiteIssues: 'Appetite Issues',
      academicDisengagement: 'Academic Disengagement',
      socialWithdrawal: 'Social Withdrawal'
    };
    return labels[metric] || metric;
  };

  const getLevelLabel = (level: number) => {
    if (level >= 8) return 'High Concern';
    if (level >= 6) return 'Moderate';
    if (level >= 4) return 'Mild';
    return 'Stable';
  };

  const renderPieChart = (data: PieChartItem[], title: string) => {
    // Create pie chart data for visualization
    const totalValue = 10; // Assuming scale of 0-10
    const pieData = [
      { name: 'Current Level', value: data[0].value, fill: data[0].color },
      { name: 'Remaining', value: totalValue - data[0].value, fill: '#f1f5f9' }
    ];

    return (
      <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-100">
        <div className="text-center mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">{title}</h4>
          <div className="relative h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: data[0].color }}>
                  {data[0].value.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">/ 10</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-600 mt-2">
            {getLevelLabel(data[0].value)}
          </div>
        </div>
      </div>
    );
  };

  // Weekly Report View
  if (currentView === 'report') {
    return (
      <div className="px-3 sm:px-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToCalendar}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm sm:text-base">Back</span>
          </button>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800">Weekly Report</h2>
          <div></div>
        </div>

        {/* Mental Health Dashboard */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-slate-200">
          
          {/* Week Range Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium shadow-lg text-sm sm:text-base">
              Mental Health Overview - {getWeekDateRange(currentWeekOffset)}
            </div>
          </div>

          {/* Activity Graph */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8 border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-2 sm:mb-0">Your Activity</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="average">Overall Wellbeing</option>
                <option value="moodDisturbance">Mood Disturbance</option>
                <option value="sleepDisruption">Sleep Disruption</option>
                <option value="appetiteIssues">Appetite Issues</option>
                <option value="academicDisengagement">Academic Disengagement</option>
                <option value="socialWithdrawal">Social Withdrawal</option>
              </select>
            </div>

            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    domain={[0, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [
                      `${value.toFixed(1)} - ${getLevelLabel(value)}`,
                      getMetricLabel(selectedMetric)
                    ]}
                  />
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mental Health Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {renderPieChart(pieChartsData.moodDisturbance, 'Mood Disturbance')}
            {renderPieChart(pieChartsData.sleepDisruption, 'Sleep Disruption')}
            {renderPieChart(pieChartsData.appetiteIssues, 'Appetite Issues')}
            {renderPieChart(pieChartsData.academicDisengagement, 'Academic Disengagement')}
            {renderPieChart(pieChartsData.socialWithdrawal, 'Social Withdrawal')}
          </div>

          {/* Weekly Summary */}
          <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-slate-100">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Weekly Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {(weeklyData.reduce((acc, day) => acc + day.average, 0) / weeklyData.length).toFixed(1)}
                </div>
                <div className="text-sm text-slate-600">Average Wellbeing</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {weeklyData.filter(day => day.average <= 5).length}
                </div>
                <div className="text-sm text-slate-600">Stable Days</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {weeklyData.filter(day => day.average > 7).length}
                </div>
                <div className="text-sm text-slate-600">High Concern Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Diary View (keeping existing implementation)
  if (currentView === 'diary') {
    return (
      <div className="px-3 sm:px-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToCalendar}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm sm:text-base">Back</span>
          </button>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">My Diary</h2>
          <div></div>
        </div>

        {/* Diary Interface */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-orange-200/50">
          {/* Diary Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block bg-gradient-to-r from-amber-600 to-orange-500 text-white px-3 py-2 sm:px-6 sm:py-2 rounded-full font-medium shadow-lg text-sm sm:text-base">
              {selectedDate && (
                <span className="block sm:hidden">
                  {selectedDate.fullDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              )}
              {selectedDate && (
                <span className="hidden sm:block">
                  {getFormattedDate(selectedDate.fullDate)}
                </span>
              )}
            </div>
          </div>

          {/* Diary Paper Effect */}
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 min-h-[400px] sm:min-h-[500px] relative"
            style={{
              backgroundImage: `repeating-linear-gradient(
                transparent,
                transparent 27px,
                #e5e7eb 27px,
                #e5e7eb 28px
              )`,
              backgroundSize: '100% 28px'
            }}
          >
            {/* Red margin line */}
            <div className="absolute left-8 sm:left-16 top-0 bottom-0 w-px bg-red-300"></div>
           
            {/* Holes for ring binding - responsive positioning */}
            <div className="absolute left-2 sm:left-6 top-8 sm:top-12 w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded-full shadow-inner"></div>
            <div className="absolute left-2 sm:left-6 top-20 sm:top-32 w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded-full shadow-inner"></div>
            <div className="absolute left-2 sm:left-6 top-32 sm:top-52 w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded-full shadow-inner"></div>

            {/* Dear Diary Header */}
            <div className="ml-8 sm:ml-12 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-700">Dear Diary,</h3>
            </div>

            {/* Writing Area */}
            <textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="How was your day? What are you feeling? Share your thoughts..."
              className="w-full h-60 sm:h-80 ml-8 sm:ml-12 pr-4 sm:pr-8 bg-transparent border-none outline-none resize-none text-slate-700 text-base sm:text-lg leading-7 sm:leading-8 placeholder-slate-400"
              style={{
                fontFamily: 'serif',
                lineHeight: '28px'
              }}
            />

            {/* Signature area */}
            <div className="ml-8 sm:ml-12 mt-6 sm:mt-8 text-right pr-4 sm:pr-8">
              <p className="text-slate-500 italic text-sm sm:text-base">With love,</p>
              <p className="text-slate-700 font-semibold text-base sm:text-lg mt-1 sm:mt-2">Your Future Self 💙</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <GradientButton
              onClick={handleSaveEntry}
              className="px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg"
            >
              Save My Thoughts
            </GradientButton>
          </div>
        </div>
      </div>
    );
  }

  // Main Calendar View (keeping existing implementation)
  return (
    <div className="px-3 sm:px-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Weekly Mind Log</h2>
        <div className="text-xs sm:text-sm text-slate-600">
          Click on any day to write in your diary
        </div>
      </div>
     
      {/* Weekly Calendar */}
      <section className="rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-slate-200 p-4 sm:p-6 shadow-xl">
        {/* Week Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={handlePreviousWeek}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
           
            <div className="text-center">
              <h3 className="text-sm sm:text-lg font-semibold text-slate-800">
                {getWeekDateRange(currentWeekOffset)}
              </h3>
              {!isCurrentWeek() && (
                <button
                  onClick={handleCurrentWeek}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 mt-1"
                >
                  Go to current week
                </button>
              )}
            </div>
           
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
         
          <GradientButton onClick={handleViewWeeklyReport} className="w-full sm:w-auto justify-center">
            <span className="hidden sm:inline">View Weekly Report</span>
            <span className="sm:hidden">Weekly Report</span>
          </GradientButton>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-3 mb-3 sm:mb-4">
          {days.map((day) => (
            <div key={day} className="text-center font-medium text-slate-500 py-2 text-xs sm:text-sm">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.substring(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-3">
          {weekDays.map((date, index) => {
            const dateKey = getDateKey(date);
            const hasEntry = !!diaryEntries[dateKey];
            const isDateToday = isToday(date);
           
            return (
              <div key={index} className="aspect-square">
                <button
                  onClick={() => handleDayClick(date)}
                  className={`w-full h-full rounded-lg sm:rounded-xl flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 group relative ${
                    isDateToday
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-400 text-white shadow-lg'
                      : hasEntry
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md hover:shadow-lg'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300'
                  }`}
                >
                  <span className="font-semibold text-sm sm:text-lg">{date.getDate()}</span>
                  <span className="text-xs opacity-80 mt-0.5 sm:mt-1 hidden sm:block">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  {hasEntry && (
                    <div className="absolute bottom-1 sm:bottom-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/80"></div>
                  )}
                  {isDateToday && (
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-400"></div>
            <span className="text-slate-600">Today</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-green-400 to-emerald-500"></div>
            <span className="text-slate-600">Entry</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-slate-100 ring-1 ring-slate-200"></div>
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