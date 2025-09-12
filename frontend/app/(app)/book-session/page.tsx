"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Shield, AlertTriangle, CheckCircle, Clock, User, MessageCircle, Video, MapPin } from "lucide-react"

export default function BookSessionPage() {
  const [formData, setFormData] = useState({
    sessionType: "",
    reason: "",
    mode: "",
    urgency: "",
    preferredDate: "",
    preferredTime: "",
    additionalNotes: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleSubmit = () => {
    console.log("Booking submission:", formData)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceedToStep2 = formData.sessionType && formData.reason && formData.mode
  const canSubmit = canProceedToStep2 && formData.urgency && formData.preferredDate && formData.preferredTime

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="max-w-lg mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <CheckCircle className="relative h-16 w-16 md:h-20 md:w-20 text-green-600 mx-auto mb-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Request Submitted Successfully
            </h2>
            <p className="text-slate-700 mb-6 text-base md:text-lg">
              Your session request has been securely sent to our mental health team.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
              <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                Your privacy is protected with end-to-end encryption
              </p>
            </div>
            <p className="text-slate-600 text-sm mb-8">
              You'll receive confirmation within 24 hours. For urgent matters, contact our crisis helpline immediately.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setCurrentStep(1)
                setFormData({
                  sessionType: "",
                  reason: "",
                  mode: "",
                  urgency: "",
                  preferredDate: "",
                  preferredTime: "",
                  additionalNotes: "",
                })
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-3 text-base md:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Book Another Session
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto py-4 sm:py-6">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Book Your Session
            </h1>
          </div>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            Connect with our mental health professionals in a secure, confidential environment.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-full transition-all duration-300 ${
              currentStep >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
            }`}>
              <User className="h-4 w-4" />
              <span className="font-medium text-sm">Details</span>
            </div>
            <div className={`h-1 w-8 rounded transition-all duration-300 ${
              currentStep >= 2 ? 'bg-blue-500' : 'bg-slate-300'
            }`}></div>
            <div className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-full transition-all duration-300 ${
              currentStep >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
            }`}>
              <Calendar className="h-4 w-4" />
              <span className="font-medium text-sm">Schedule</span>
            </div>
          </div>
        </div>

        {/* Single Privacy Notice */}
        <Card className="mb-6 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <p className="text-blue-800 font-medium text-sm">
                🔒 Your information is encrypted and completely confidential.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r  from-blue-500 to-indigo-600 text-white py-4 px-4">
            <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
              {currentStep === 1 ? (
                <>
                  <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                  Tell Us About Your Session
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 md:h-6 md:w-6" />
                  Choose Your Schedule
                </>
              )}
            </CardTitle>
            <CardDescription className="text-indigo-100">
              {currentStep === 1
                ? "Help us understand what kind of support you're looking for."
                : "Select your preferred date, time, and any additional preferences."
              }
            </CardDescription>
          </CardHeader>
         
          <CardContent className="p-4 md:p-6">
            <div className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Session Type */}
                  <div className="space-y-3">
                    <Label className="text-base md:text-lg font-semibold text-slate-800">What type of session do you need?</Label>
                    <Select onValueChange={(value) => handleInputChange("sessionType", value)} value={formData.sessionType}>
                      <SelectTrigger className="w-full h-12 text-base border-2 hover:border-blue-400 focus:ring-blue-500 transition-colors">
                        <SelectValue placeholder="Choose the type of support" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="individual-counseling">💬 Individual Counseling</SelectItem>
                         <SelectItem value="crisis-support">🚨 Crisis Support</SelectItem>
                         <SelectItem value="academic-stress">📚 Academic Stress Management</SelectItem>
                         <SelectItem value="anxiety-depression">🌱 Anxiety & Depression Support</SelectItem>
                         <SelectItem value="relationship-issues">❤️ Relationship & Social Issues</SelectItem>
                         <SelectItem value="career-guidance">🎯 Career & Future Planning</SelectItem>
                         <SelectItem value="trauma-support">🛡️ Trauma & PTSD Support</SelectItem>
                         <SelectItem value="group-therapy">👥 Group Therapy Session</SelectItem>
                         <SelectItem value="other">✨ Other (please specify below)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reason */}
                  <div className="space-y-3">
                    <Label htmlFor="reason" className="text-base md:text-lg font-semibold text-slate-800">
                      What would you like to discuss?
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Share what's on your mind..."
                      value={formData.reason}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      className="min-h-[100px] resize-none text-base border-2 hover:border-blue-400 focus:ring-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Session Mode - UPDATED WITH BETTER VISUAL FEEDBACK */}
                  <div className="space-y-3">
                    <Label className="text-base md:text-lg font-semibold text-slate-800">How would you prefer to meet?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Virtual Session Option */}
                      <div 
                        onClick={() => handleInputChange("mode", "virtual")}
                        className={`cursor-pointer transition-all duration-200 rounded-xl p-4 md:p-5 border-2 ${
                          formData.mode === "virtual" 
                            ? "border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-200" 
                            : "border-slate-300 bg-white hover:border-blue-400 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <Video className="h-7 w-7 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
                          <div className="flex-grow">
                            <div className="font-semibold text-slate-800">Virtual Session</div>
                            <div className="text-slate-600 text-sm">Secure video call</div>
                          </div>
                          <div className={`transition-all duration-200 ${
                            formData.mode === "virtual" ? "opacity-100 scale-100" : "opacity-0 scale-75"
                          }`}>
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* In-Person Session Option */}
                      <div 
                        onClick={() => handleInputChange("mode", "physical")}
                        className={`cursor-pointer transition-all duration-200 rounded-xl p-4 md:p-5 border-2 ${
                          formData.mode === "physical" 
                            ? "border-purple-600 bg-purple-50 shadow-lg ring-2 ring-purple-200" 
                            : "border-slate-300 bg-white hover:border-purple-400 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <MapPin className="h-7 w-7 md:h-8 md:w-8 text-purple-600 flex-shrink-0" />
                          <div className="flex-grow">
                            <div className="font-semibold text-slate-800">In-Person Session</div>
                            <div className="text-slate-600 text-sm">At our center</div>
                          </div>
                          <div className={`transition-all duration-200 ${
                            formData.mode === "physical" ? "opacity-100 scale-100" : "opacity-0 scale-75"
                          }`}>
                            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!canProceedToStep2}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Continue to Schedule
                      <Calendar className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Urgency Level - UPDATED WITH BETTER VISUAL FEEDBACK */}
                  <div className="space-y-3">
                    <Label className="text-base md:text-lg font-semibold text-slate-800">How soon do you need this session?</Label>
                    <div className="space-y-3">
                      {/* Routine Option */}
                      <div 
                        onClick={() => handleInputChange("urgency", "routine")}
                        className={`cursor-pointer transition-all duration-200 rounded-xl p-4 border-2 ${
                          formData.urgency === "routine" 
                            ? "border-green-600 bg-green-50 shadow-lg ring-2 ring-green-200" 
                            : "border-green-300 bg-white hover:border-green-400 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <Clock className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <div className="flex-grow">
                            <div className="font-semibold text-green-700 text-base mb-1">Routine</div>
                            <div className="text-slate-600 text-sm">Within 1-2 weeks</div>
                          </div>
                          <div className={`transition-all duration-200 ${
                            formData.urgency === "routine" ? "opacity-100 scale-100" : "opacity-0 scale-75"
                          }`}>
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Priority Option */}
                      <div 
                        onClick={() => handleInputChange("urgency", "priority")}
                        className={`cursor-pointer transition-all duration-200 rounded-xl p-4 border-2 ${
                          formData.urgency === "priority" 
                            ? "border-orange-600 bg-orange-50 shadow-lg ring-2 ring-orange-200" 
                            : "border-orange-300 bg-white hover:border-orange-400 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <Clock className="h-6 w-6 text-orange-600 flex-shrink-0" />
                          <div className="flex-grow">
                            <div className="font-semibold text-orange-700 text-base mb-1">Priority</div>
                            <div className="text-slate-600 text-sm">Within 3-5 days</div>
                          </div>
                          <div className={`transition-all duration-200 ${
                            formData.urgency === "priority" ? "opacity-100 scale-100" : "opacity-0 scale-75"
                          }`}>
                            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Urgent Option */}
                      <div 
                        onClick={() => handleInputChange("urgency", "urgent")}
                        className={`cursor-pointer transition-all duration-200 rounded-xl p-4 border-2 ${
                          formData.urgency === "urgent" 
                            ? "border-red-700 bg-red-50 shadow-lg ring-2 ring-red-200" 
                            : "border-red-300 bg-white hover:border-red-500 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                          <div className="flex-grow">
                            <div className="font-semibold text-red-700 text-base mb-1">Urgent</div>
                            <div className="text-red-600 text-sm">Within 24-48 hours</div>
                          </div>
                          <div className={`transition-all duration-200 ${
                            formData.urgency === "urgent" ? "opacity-100 scale-100" : "opacity-0 scale-75"
                          }`}>
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-base md:text-lg font-semibold text-slate-800">
                        Preferred Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="h-12 text-base border-2 hover:border-blue-400 focus:ring-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-base md:text-lg font-semibold text-slate-800">
                        Preferred Time
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("preferredTime", value)} value={formData.preferredTime}>
                        <SelectTrigger className="h-12 text-base border-2 hover:border-blue-400 focus:ring-blue-500 transition-colors">
                          <SelectValue placeholder="Choose a time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-base md:text-lg font-semibold text-slate-800">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific preferences..."
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                      className="min-h-[80px] resize-none text-base border-2 hover:border-blue-400 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="w-full sm:w-auto sm:flex-1 py-3 text-base font-semibold border-2 hover:bg-slate-100 hover:border-slate-400"
                    >
                      Back to Details
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className="w-full sm:w-auto sm:flex-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Submit Booking Request
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Crisis Notice */}
        <Card className="mt-6 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 border-0 shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-red-800 text-lg mb-2">Need Immediate Help?</h4>
                <p className="text-red-700 mb-3">
                  If you're in crisis, please reach out now:
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-sm">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                    📞 Campus Crisis: 1800-XXX-XXXX
                  </span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                    🆘 National: 988
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}