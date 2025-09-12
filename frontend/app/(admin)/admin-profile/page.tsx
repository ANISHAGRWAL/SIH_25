"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Camera, Save, Edit3, Shield, Briefcase, Mail, Phone } from "lucide-react";

// --- Type Definitions ---
// Define the shape of the AdminProfile object.
// This is the most crucial part for fixing all the type errors.
interface AdminProfile {
  id: string;
  name: string;
  email: string;
  contact: string;
  role: string;
  department: string;
  employeeId: string;
  bio: string;
  avatarUrl: string | null;
  lastLogin: string;
}

// --- Mock API Functions ---
// The parameters now have explicit types.

/**
 * Mocks fetching admin details from the server.
 * @param {string} adminId - The ID of the admin to fetch.
 * @returns {Promise<{ok: boolean, data?: AdminProfile, error?: string}>}
 */
const getAdminDetails = async (adminId: string): Promise<{ ok: boolean, data?: AdminProfile, error?: string }> => {
  console.log(`Fetching details for admin: ${adminId}`);
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    ok: true,
    data: {
      id: "admin-001",
      name: "Alex Johnson",
      email: "alex.j@sahayog.admin.com",
      contact: "+1 123-456-7890",
      role: "Super Admin",
      department: "System Operations",
      employeeId: "SA-98765",
      bio: "Lead administrator responsible for system integrity, user management, and overseeing platform operations. Passionate about creating efficient and secure digital environments.",
      avatarUrl: null,
      lastLogin: new Date(Date.now() - 86400000).toISOString(),
    },
  };
};

/**
 * Mocks updating admin details on the server.
 * @param {string} adminId - The ID of the admin to update.
 * @param {Partial<AdminProfile>} payload - The data to update.
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
const updateAdminDetails = async (adminId: string, payload: Partial<AdminProfile>): Promise<{ ok: boolean, error?: string }> => {
  console.log(`Updating details for admin: ${adminId}`, payload);
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (payload.name === "") {
    return { ok: false, error: "Name cannot be empty." };
  }
  return { ok: true };
};


// --- UI Components (placeholders) ---
// These components now have proper props types defined.

interface CardProps { children: React.ReactNode; className?: string; }
const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-white border border-gray-200/80 rounded-xl shadow-sm ${className}`}>{children}</div>
);
interface CardHeaderProps { children: React.ReactNode; className?: string; }
const CardHeader = ({ children, className = "" }: CardHeaderProps) => <div className={`p-5 border-b border-gray-200/80 bg-slate-50/50 rounded-t-xl ${className}`}>{children}</div>;
interface CardTitleProps { children: React.ReactNode; className?: string; }
const CardTitle = ({ children, className = "" }: CardTitleProps) => <h3 className={`text-lg font-semibold text-slate-800 ${className}`}>{children}</h3>;
interface CardContentProps { children: React.ReactNode; className?: string; }
const CardContent = ({ children, className = "" }: CardContentProps) => <div className={`p-6 ${className}`}>{children}</div>;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { children: React.ReactNode; }
const Button = ({ children, ...props }: ButtonProps) => <button {...props}>{children}</button>;
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = (props: InputProps) => <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600 disabled:border-slate-200 disabled:cursor-not-allowed transition-colors" />;
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = (props: TextareaProps) => <textarea {...props} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors" />;
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { children: React.ReactNode; }
const Label = ({ children, ...props }: LabelProps) => <label {...props} className="block text-sm font-medium text-slate-700 mb-1.5">{children}</label>;
interface AvatarProps { children: React.ReactNode; className?: string; }
const Avatar = ({ children, className = "" }: AvatarProps) => <div className={`relative rounded-full flex items-center justify-center ${className}`}>{children}</div>;
interface AvatarImageProps { src: string | null; alt: string; className?: string; }
const AvatarImage = ({ src, alt, className = "" }: AvatarImageProps) => <img src={src || undefined} alt={alt} className={`w-full h-full object-cover rounded-full ${className}`} />;
interface AvatarFallbackProps { children: React.ReactNode; className?: string; }
const AvatarFallback = ({ children, className = "" }: AvatarFallbackProps) => <div className={`w-full h-full rounded-full flex items-center justify-center ${className}`}>{children}</div>;

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<AdminProfile | null>(null);

  const { user } = { user: { uid: 'admin-001' } };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;

      setLoading(true);
      const res = await getAdminDetails(user.uid);
      if (res.ok && res.data) {
        setProfileData(res.data);
      } else {
        toast.error(res.error || "Failed to load admin profile");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user?.uid]);

  const handleInputChange = (field: keyof AdminProfile, value: string) => {
    if (!profileData) return;
    setProfileData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (!user?.uid || !profileData) return;

    const updatePayload: Partial<AdminProfile> = {
      name: profileData.name,
      contact: profileData.contact,
      department: profileData.department,
      bio: profileData.bio,
    };

    const res = await updateAdminDetails(user.uid, updatePayload);

    if (res.ok) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error(res.error || "Update failed. Please try again.");
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
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Profile
          </h1>
          <p className="text-slate-600 mt-1">Manage your administrator account details.</p>
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
                <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
                <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white font-semibold">
                  {profileData.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-full shadow-md hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="text-2xl font-bold text-slate-900 truncate">{profileData.name}</h2>
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
          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={profileData.employeeId}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={profileData.role}
              disabled
            />
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
          <div>
            <Label>Last Login</Label>
            <p className="text-sm text-slate-600">{new Date(profileData.lastLogin).toLocaleString()}</p>
          </div>
          <div>
            <Button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors duration-200">
              Change Password
            </Button>
            <p className="text-xs text-slate-500 mt-2">For security, you will be logged out after changing your password.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}