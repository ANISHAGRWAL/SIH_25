"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Edit3 } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    // Existing signup data
    fullName: "Anekant Jain",
    organization: "Delhi University",
    email: "anekantjainsagar@gmail.com",

    // New profile fields
    avatar: "/diverse-avatars.png",
    emergencyContactPerson: "",
    emergencyContactNumber: "",
    city: "",
    yearStudying: "",
    department: "",
    gender: "",
    age: "",
    bio: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Here you would typically save to database
    console.log("Saving profile data:", profileData)
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hello {profileData.fullName.split(" ")[0]},</h1>
          <p className="text-slate-600 mt-1">Manage your profile information</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
          {isEditing ? "Save Profile" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Avatar Section */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
                  {profileData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-full hover:from-blue-600 hover:to-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">{profileData.fullName}</h3>
              <p className="text-slate-600">{profileData.organization}</p>
              <p className="text-slate-500 text-sm">{profileData.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                disabled={!isEditing}
                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div>
              <Label htmlFor="organization" className="text-slate-700 font-medium">Organization</Label>
              <Input
                id="organization"
                value={profileData.organization}
                onChange={(e) => handleInputChange("organization", e.target.value)}
                disabled={!isEditing}
                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-slate-700 font-medium">City</Label>
              <Input
                id="city"
                value={profileData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your city"
                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-slate-700 font-medium">Age</Label>
              <Input
                id="age"
                type="number"
                value={profileData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your age"
                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div>
              <Label htmlFor="gender" className="text-slate-700 font-medium">Gender</Label>
              <Select
                value={profileData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yearStudying" className="text-slate-700 font-medium">Year of Study</Label>
              <Select
                value={profileData.yearStudying}
                onValueChange={(value) => handleInputChange("yearStudying", value)}
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st-year">1st Year</SelectItem>
                  <SelectItem value="2nd-year">2nd Year</SelectItem>
                  <SelectItem value="3rd-year">3rd Year</SelectItem>
                  <SelectItem value="4th-year">4th Year</SelectItem>
                  <SelectItem value="masters-1st">Masters 1st Year</SelectItem>
                  <SelectItem value="masters-2nd">Masters 2nd Year</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department" className="text-slate-700 font-medium">Department</Label>
              <Input
                id="department"
                value={profileData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., Computer Science, Psychology"
                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContactPerson" className="text-slate-700 font-medium">Emergency Contact Person</Label>
              <Input
                id="emergencyContactPerson"
                value={profileData.emergencyContactPerson}
                onChange={(e) => handleInputChange("emergencyContactPerson", e.target.value)}
                disabled={!isEditing}
                placeholder="Full name of emergency contact"
                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div>
              <Label htmlFor="emergencyContactNumber" className="text-slate-700 font-medium">Emergency Contact Number</Label>
              <Input
                id="emergencyContactNumber"
                type="tel"
                value={profileData.emergencyContactNumber}
                onChange={(e) => handleInputChange("emergencyContactNumber", e.target.value)}
                disabled={!isEditing}
                placeholder="+91 XXXXX XXXXX"
                className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="bio" className="text-slate-700 font-medium">Bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
            placeholder="Tell us a bit about yourself, your interests, goals, or anything you'd like to share..."
            className="mt-1 min-h-[100px] border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </CardContent>
      </Card>

      {/* Save Button (when editing) */}
      {isEditing && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}