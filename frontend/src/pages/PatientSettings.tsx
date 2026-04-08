import {
  Bell,
  CreditCard,
  Globe,
  Lock,
  Mail,
  MapPin,
  Palette,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Label } from "../components/common/Label";
import { Switch } from "../components/common/Switch";
import { Textarea } from "../components/common/Textarea";
import { ProfileSettingsShell, type ProfileSettingsSection } from "../components/profile/ProfileSettingsShell";
import { useAuth } from "../context/AuthContext";
import { APP_NAME } from "../utils/brand";

const notificationSettings = [
  {
    title: "Email Notifications",
    description: "Receive appointment reminders and report updates by email.",
    enabled: true,
  },
  {
    title: "SMS Alerts",
    description: "Get queue changes and care reminders by text message.",
    enabled: true,
  },
  {
    title: "Push Notifications",
    description: `Allow browser notifications for live updates from ${APP_NAME}.`,
    enabled: false,
  },
];

const privacySettings = [
  {
    title: "Share Data With Doctors",
    description: "Allow your care team to review your reports and visit history.",
    enabled: true,
  },
  {
    title: "Profile Visibility",
    description: "Make your profile visible to providers before appointments.",
    enabled: true,
  },
  {
    title: "Research Consent",
    description: "Contribute anonymized data to service quality improvements.",
    enabled: false,
  },
];

function SettingToggle({
  title,
  description,
  enabled,
}: {
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
      </div>
      <Switch defaultChecked={enabled} className="mt-1" />
    </div>
  );
}

export function PatientSettings() {
  const { user } = useAuth();
  const [firstName = "Rohan", lastName = "Verma"] = (user?.name || "Rohan Verma").split(" ");

  const sections: ProfileSettingsSection[] = [
    {
      id: "profile",
      label: "Personal Info",
      description: "Edit your core profile details and contact information.",
      icon: User,
      content: (
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50">
              <User className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              <p className="text-sm text-gray-500">Keep your patient profile current for faster care.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={firstName} className="h-11 rounded-xl bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={lastName} className="h-11 rounded-xl bg-gray-50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || "rohan.verma@example.com"}
                  className="h-11 rounded-xl bg-gray-50 pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input id="phone" type="tel" defaultValue="+91 98765 42001" className="h-11 rounded-xl bg-gray-50 pl-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                <Textarea
                  id="address"
                  rows={4}
                  defaultValue="Indiranagar, Bengaluru, Karnataka"
                  className="rounded-xl bg-gray-50 pl-11 pt-3"
                />
              </div>
            </div>

            <Button className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-sm">
              Save Profile
            </Button>
          </div>
        </Card>
      ),
    },
    {
      id: "security",
      label: "Security",
      description: "Control passwords, sign-in protection, and account safety.",
      icon: Lock,
      content: (
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
              <Lock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              <p className="text-sm text-gray-500">Update your password and protect your account.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" className="h-11 rounded-xl bg-gray-50" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" className="h-11 rounded-xl bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" className="h-11 rounded-xl bg-gray-50" />
              </div>
            </div>

            <SettingToggle
              title="Two-Factor Authentication"
              description="Add a verification step when signing in from a new device."
            />
            <SettingToggle
              title="Login Alerts"
              description="Receive an email when your account is accessed from a new location."
              enabled
            />

            <Button className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-sm">
              Update Security
            </Button>
          </div>
        </Card>
      ),
    },
    {
      id: "billing",
      label: "Billing",
      description: "Manage payment methods and default billing preferences.",
      icon: CreditCard,
      content: (
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <p className="text-sm text-gray-500">Manage cards used for appointments and services.</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl">
              Add Card
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/25</p>
                </div>
              </div>
              <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">Primary</span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">•••• •••• •••• 9831</p>
                  <p className="text-xs text-gray-500">Expires 08/27</p>
                </div>
              </div>
              <Button variant="ghost" className="rounded-xl text-sm text-gray-600">
                Edit
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      description: `Choose how ${APP_NAME} keeps you updated.`,
      icon: Bell,
      content: (
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              <p className="text-sm text-gray-500">Stay informed without getting overwhelmed.</p>
            </div>
          </div>

          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <SettingToggle key={setting.title} {...setting} />
            ))}
          </div>
        </Card>
      ),
    },
    {
      id: "privacy",
      label: "Privacy",
      description: "Review data sharing and profile visibility controls.",
      icon: Shield,
      content: (
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50">
              <Shield className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Privacy Controls</h3>
              <p className="text-sm text-gray-500">Decide how your health data is shared and displayed.</p>
            </div>
          </div>

          <div className="space-y-4">
            {privacySettings.map((setting) => (
              <SettingToggle key={setting.title} {...setting} />
            ))}
          </div>
        </Card>
      ),
    },
    {
      id: "preferences",
      label: "Preferences",
      description: "Set app-level language, timezone, and display preferences.",
      icon: Palette,
      content: (
        <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-50">
              <Palette className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">App Preferences</h3>
              <p className="text-sm text-gray-500">Personalize how the dashboard works for you.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select id="language" className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select id="timezone" className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm">
                <option>IST (UTC+5:30)</option>
                <option>GST (UTC+4)</option>
                <option>UTC</option>
              </select>
            </div>

            <SettingToggle
              title="Simplified View"
              description="Use larger touch targets and simplified labels throughout the dashboard."
              enabled
            />

            <Button className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
              Save Preferences
            </Button>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <ProfileSettingsShell
      title="Profile & Settings"
      description="Manage your account, safety controls, billing, and personal preferences in one clean workspace."
      sections={sections}
      defaultSectionId="profile"
    />
  );
}
