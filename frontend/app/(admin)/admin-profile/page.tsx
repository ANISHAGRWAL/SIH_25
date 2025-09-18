"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Camera,
  Save,
  Edit3,
  Shield,
  Briefcase,
  Mail,
  Phone,
} from "lucide-react";
import { getUserDetails, updateUserDetails } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChangePasswordModal from "@/components/changePassword";

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
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
        toast.error("Failed to load profile");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (field: keyof ICompleteUser, value: string) => {
    if (!profileData) return;
    setProfileData((prev) => (prev ? { ...prev, [field]: value } : null));
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
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-slate-600 text-lg">
          Loading Admin Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Profile</h1>
          <p className="text-slate-600 mt-1">
            Manage your administrator account details.
          </p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </>
          )}
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <Avatar className="w-24 h-24 text-2xl">
                <AvatarImage
                  src={
                    avatarPreview || profileData.avatarUrl || "/placeholder.svg"
                  }
                  alt={profileData.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white font-semibold">
                  {profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="text-2xl font-bold text-slate-900 truncate">
                {profileData.name}
              </h2>
              <p className="flex items-center justify-center sm:justify-start gap-2 text-slate-600 mt-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>{profileData.role}</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 text-sm mt-1 truncate">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{profileData.email}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Details */}
      <Card>
        <CardHeader>
          <CardTitle>Administrator Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={profileData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              value={profileData.contact}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={profileData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          {/* <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input id="employeeId" value={profileData.employeeId} disabled />
          </div> */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={profileData.email} disabled />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={profileData.role} disabled />
          </div>
        </CardContent>
      </Card>

      {/* About Me */}
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio || ""}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
            placeholder="Tell us a little about your role and responsibilities..."
          />
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <div>
            <Label>Last Login</Label>
            <p className="text-sm text-slate-600">
              {new Date(profileData.lastLogin).toLocaleString()}
            </p>
          </div> */}
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
      <ChangePasswordModal
        email={profileData.email}
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}
