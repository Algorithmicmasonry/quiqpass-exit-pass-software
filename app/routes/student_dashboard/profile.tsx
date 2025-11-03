import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { User, Mail, Phone, MapPin, Users, Save, Bell } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { DashboardHeaders } from "~/components/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { femaleHostels, levels, MaleHostels } from "data/onboardingData";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  matricNo: string;
  guardianName: string;
  hostel: string;
  guardianPhoneNumber: string;
  level: string;
  roomNumber: string;
  notifyParent: boolean;
  gender?: string;
  // photoUrl: string // Commented out for later implementation
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    matricNo: "",
    hostel: "",
    roomNumber: "",
    guardianName: "",
    guardianPhoneNumber: "",
    level: "",
    notifyParent: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // updateUser({
    //   name: formData.name,
    //   email: formData.email,
    //   phone: formData.phone,
    //   parentName: formData.parentName,
    //   parentPhone: formData.parentPhone,
    //   parentEmail: formData.parentEmail,
    //   notifyParent: formData.notifyParent,
    // })

    setIsSaving(false);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    // setFormData({
    //   name: user?.name || "",
    //   email: user?.email || "",
    //   phone: user?.phone || "",
    //   studentId: user?.studentId || "",
    //   hostel: user?.hostel || "",
    //   roomNumber: user?.roomNumber || "",
    //   parentName: user?.parentName || "",
    //   parentPhone: user?.parentPhone || "",
    //   parentEmail: user?.parentEmail || "",
    //   notifyParent: user?.notifyParent ?? true,
    // })
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeaders
          mainText="My Profile"
          subText="Update your personal information and preferences"
        />
        <div className="flex items-center justify-between">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your basic account and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={formData.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Matric No</Label>
              <Input id="studentId" value={formData.matricNo} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleInputChange("level", value)}
                name="level"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level} Level
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel</Label>
              <Select
                value={formData.hostel}
                onValueChange={(value) => handleInputChange("hostel", value)}
                name="hostel"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your hostel" />
                </SelectTrigger>
                <SelectContent>
                  {formData?.gender == "male"
                    ? MaleHostels.map((hostel) => (
                        <SelectItem key={hostel} value={hostel}>
                          {hostel}
                        </SelectItem>
                      ))
                    : femaleHostels.map((hostel) => (
                        <SelectItem key={hostel} value={hostel}>
                          {hostel}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input id="roomNumber" value={formData.roomNumber} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Parent/Guardian Information
          </CardTitle>
          <CardDescription>
            Contact details for parent notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parentName">Parent/Guardian Name</Label>
            <Input
              id="parentName"
              value={formData.guardianName}
              onChange={(e) =>
                setFormData({ ...formData, guardianName: e.target.value })
              }
              disabled={!isEditing}
              placeholder="Enter parent or guardian name"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="parentPhone"
                  type="tel"
                  value={formData.guardianPhoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guardianPhoneNumber: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                  className="pl-9"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifyParent" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Parent Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Send notifications to parent when you check out or check in
              </p>
            </div>
            <Switch
              id="notifyParent"
              checked={formData.notifyParent}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, notifyParent: checked })
              }
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
