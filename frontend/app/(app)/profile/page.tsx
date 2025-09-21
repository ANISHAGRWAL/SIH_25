// src/components/pages/ProfilePage.tsx (Frontend Code)

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, Edit3, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  getUserDetails,
  updateUserDetails,
  becomeVolunteer,
} from "../../../actions/student"; // Ensure this path is correct
import ChangePasswordModal from "@/components/changePassword";

// A matching interface for user data
interface ICompleteUser {
  id: string;
  name: string;
  email: string;
  organization?: string;
  contact?: string;
  city?: string;
  age?: string;
  gender?: "male" | "female";
  yearOfStudy?: string;
  department?: string;
  emergencyContact?: string;
  emergencyContactPerson?: string;
  bio?: string;
  degree?: string;
  avatarUrl?: string;
  volunteer?: boolean;
  role?: "admin" | "student";
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmittingVolunteer, setIsSubmittingVolunteer] = useState(false);
  const [profileData, setProfileData] = useState<ICompleteUser | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      setLoading(true);
      const res = await getUserDetails(token);
      if (res.ok) {
        setProfileData(res.data as ICompleteUser);
      } else {
        toast.error(res.error || "Failed to load profile");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = <K extends keyof ICompleteUser>(
    field: K,
    value: ICompleteUser[K]
  ) => {
    if (!profileData) return;
    setProfileData((prev) => ({ ...prev!, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSave = async () => {
    if (!token || !profileData) return;

    const updatePayload: Partial<ICompleteUser> = {
      name: profileData.name,
      contact: profileData.contact,
      city: profileData.city,
      age: profileData.age,
      gender: profileData.gender,
      yearOfStudy: profileData.yearOfStudy,
      department: profileData.department,
      emergencyContact: profileData.emergencyContact,
      emergencyContactPerson: profileData.emergencyContactPerson,
      bio: profileData.bio,
      degree: profileData.degree,
    };

    const res = await updateUserDetails(
      token,
      updatePayload,
      avatarFile || undefined
    );

    if (res.ok) {
      toast.success("Profile updated!");
      setIsEditing(false);
    } else {
      toast.error(res.error || "Update failed");
    }
  };

  const handleBecomeVolunteer = async () => {
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    // Log #1: Check if the function starts
    console.log("Attempting to become a volunteer...");

    setIsSubmittingVolunteer(true);
    const res = await becomeVolunteer(token);

    // Log #2: Check the API response
    console.log("API Response:", res);

    if (res.ok) {
      // Log #3: Confirm we are entering the success block
      console.log("API call was successful. Updating local state.");

      // This is the safer "functional update" form for useState.
      // It guarantees the update is based on the most recent state.
      setProfileData((currentProfileData) => {
        if (currentProfileData) {
          // Log #4: See the state BEFORE the update
          console.log("State before update:", currentProfileData);

          const updatedData = { ...currentProfileData, volunteer: true };

          // Log #5: See the state AFTER the update
          console.log("State after update:", updatedData);

          return updatedData;
        }
        return currentProfileData; // Return old data if it's null for some reason
      });

      toast.success("Your request has been sent!");
    } else {
      console.error("API call failed:", res.error);
    }

    setIsSubmittingVolunteer(false);
  };

  if (loading || !profileData) {
    return (
      <div className="text-center text-slate-600 mt-20 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hello {profileData.name.split(" ")[0]},
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your profile information
          </p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <Avatar className="w-24 h-24">
                {avatarPreview || profileData.avatarUrl ? (
                  <AvatarImage
                    src={avatarPreview || profileData.avatarUrl}
                    alt="Avatar"
                  />
                ) : (
                  <AvatarFallback className="text-4xl bg-gradient-to-r from-blue-500 to-indigo-400 text-white">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-full z-0">
                    <Camera className="w-4 h-4" />
                  </div>
                </>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                {profileData.name}
              </h3>
              <p className="text-slate-600">{profileData.organization}</p>
              <p className="text-slate-500 text-sm">{profileData.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={profileData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={profileData.email} disabled />
          </div>
          <div>
            <Label>Contact</Label>
            <Input
              value={profileData.contact || ""}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>City</Label>
            <Input
              value={profileData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Age</Label>
            <Input
              value={profileData.age || ""}
              onChange={(e) => handleInputChange("age", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Gender</Label>
            <Select
              value={profileData.gender || ""}
              onValueChange={(value) =>
                handleInputChange("gender", value as "male" | "female")
              }
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Other Cards ... */}

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="font-semibold text-slate-800">Security</Label>
            <Button
              className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors duration-200"
              onClick={() => setShowChangePasswordModal(true)}
            >
              Change Password
            </Button>
            <p className="text-xs text-slate-500 mt-2">
              For security, you'll be logged out after changing your password.
            </p>
          </div>

          {profileData.role === "student" && (
            <div>
              <Label className="font-semibold text-slate-800">
                Volunteering
              </Label>
              {profileData.volunteer ? (
                <p className="text-sm text-slate-600 mt-2">
                  Your volunteer application has been submitted or approved.
                </p>
              ) : (
                <>
                  <Button
                    type="button" // Add this line
                    onClick={handleBecomeVolunteer}
                    disabled={isSubmittingVolunteer}
                    className="mt-2 flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800"
                  >
                    <UserPlus className="w-4 h-4" />
                    {isSubmittingVolunteer
                      ? "Submitting..."
                      : "Become a Volunteer"}
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">
                    Help your peers by becoming a volunteer. Your request will
                    be sent to an administrator for approval.
                  </p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ChangePasswordModal
        email={profileData.email}
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}

// Rest of the component and helper functions remain unchanged.