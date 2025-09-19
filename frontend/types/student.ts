interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "admin" | "student";
  volunteer?: boolean;
}

interface ICompleteUser extends User {
  password: string;
  organization: string;
  contact: string;
  idProofUrl: string;
  city?: string;
  age?: string;
  gender?: "male" | "female";
  yearOfStudy?: string;
  department?: string;
  emergencyContact?: string;
  emergencyContactPerson?: string;
  bio?: string;
  degree?: string;
  createdAt: Date;
  updatedAt: Date;
}
