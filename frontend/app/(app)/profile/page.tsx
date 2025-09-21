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
import { Camera, Save, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { getUserDetails, updateUserDetails, becomeVolunteer, appliedForVolunteer } from "@/actions/student";
import ChangePasswordModal from "@/components/changePassword";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ICompleteUser | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<"not_applied" | "pending" | "approved" | "is_volunteer">("not_applied");
  const [volunteerLoading, setVolunteerLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const userAvatar = (
    <svg
      className="w-5 h-5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) return;

      setLoading(true);

      const userDetailsRes = await getUserDetails(token);

      if (userDetailsRes.ok) {
        const userData = userDetailsRes.data as ICompleteUser;
        setProfileData(userData);

        // Check if user is already a volunteer first
        if (userData.volunteer === true) {
          setVolunteerStatus("is_volunteer");
        } else {
          // If not a volunteer, check for a pending request
          const volunteerRes = await appliedForVolunteer(token);
          if (volunteerRes.ok && volunteerRes.data.applied) {
            setVolunteerStatus("pending");
          } else {
            setVolunteerStatus("not_applied");
          }
        }
      } else {
        toast.error("Failed to load profile");
      }

      setLoading(false);
    };

    fetchAllData();
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

  const handleBecomeVolunteer = async () => {
    if (!token) return;
    setVolunteerLoading(true);
    const res = await becomeVolunteer(token);
    if (res.ok) {
      setVolunteerStatus("pending");
      toast.success("Volunteer request submitted successfully!");
    } else {
      toast.error(res.error || "Failed to submit volunteer request.");
    }
    setVolunteerLoading(false);
  };

  const handleSave = async () => {
    if (!token || !profileData) return;

    const updatePayload: Partial<ICompleteUser> = {
      name: profileData.name,
      email: profileData.email,
      organization: profileData.organization,
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

  if (loading || !profileData) {
    return (
      <div className="text-center text-slate-600 mt-20 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hello {profileData.name.split(" ")[0]},
          </h1>
          <p className="text-slate-600 mt-1">Manage your profile information</p>
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
            <Input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Contact</Label>
            <Input
              value={profileData.contact}
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

      {/* Academic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Year of Study</Label>
            <Input
              value={profileData.yearOfStudy || ""}
              onChange={(e) => handleInputChange("yearOfStudy", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Department</Label>
            <Input
              value={profileData.department || ""}
              onChange={(e) => handleInputChange("department", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Degree</Label>
            <Input
              value={profileData.degree || ""}
              onChange={(e) => handleInputChange("degree", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Contact Person</Label>
            <Input
              value={profileData.emergencyContactPerson || ""}
              onChange={(e) =>
                handleInputChange("emergencyContactPerson", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Contact Number</Label>
            <Input
              value={profileData.emergencyContact || ""}
              onChange={(e) =>
                handleInputChange("emergencyContact", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Bio</Label>
          <Textarea
            value={profileData.bio || ""}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>
      
      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors duration-200"
              onClick={() => setShowChangePasswordModal(true)}
            >
              Change Password
            </Button>
            <p className="text-xs text-slate-500 mt-2">
              For security, you will be logged out after changing your password.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Volunteer Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Status</CardTitle>
        </CardHeader>
        <CardContent>
          {volunteerStatus === "is_volunteer" && (
            <p className="text-green-600 font-semibold">
              You are a volunteer 🎉
            </p>
          )}
          {volunteerStatus === "pending" && (
            <p className="text-yellow-600 font-semibold">
              Your request is pending.
            </p>
          )}
          {volunteerStatus === "not_applied" && (
            <Button
              onClick={handleBecomeVolunteer}
              disabled={volunteerLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {volunteerLoading ? "Submitting..." : "Become a Volunteer"}
            </Button>
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