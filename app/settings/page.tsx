"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  Bell,
  Globe,
  ShieldCheck,
  Info,
  LogOut,
  CreditCard,
  MessageSquare,
  FileText,
  Lock,
  Clock,
  CheckCircle,
  Zap,
  AlertCircle,
} from "lucide-react";
import SettingsSection from "@/components/SettingsSection";
import SettingsItem from "@/components/SettingsItem";

export default function SettingsPage() {
  // Mock state for settings
  const [notifications, setNotifications] = useState({
    billReminders: true,
    paymentConfirmations: true,
    goalUpdates: false,
    securityAlerts: true,
  });

  const [security, setSecurity] = useState({
    transactionSigning: true,
  });

  const stellarAddress = "GCF2...7P3Q";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="ml-4 text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-6">
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon={<Wallet className="w-5 h-5" />}
            title="Stellar Address"
            description="Connected Wallet"
            type="text"
            value={stellarAddress}
          />
          <SettingsItem
            icon={<CreditCard className="w-5 h-5" />}
            title="Wallet Status"
            description="Connected via Freighter"
            type="navigation"
          />
          <SettingsItem
            icon={<LogOut className="w-5 h-5 text-red-500" />}
            title="Change Wallet"
            onClick={() => console.log("Change wallet")}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <div className="mb-8 bg-[#010101] p-4">
          {/* Section header (matches your sample UI) */}
          <div className="px-4 mb-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center bg-[#DC262633] w-[40px] h-[40px] rounded-[14px]">
                <Bell className="w-[20px] h-[20px] text-[#DC2626]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#FFFFFF]">
                  Notifications
                </h2>
                <p className="text-[#FFFFFF80] text-[12px] -mt-1">
                  Manage alert preferences
                </p>
              </div>
            </div>
          </div>

          {/* Dark card list */}
          <SettingsSection title="" variant="dark-card">
            <SettingsItem
              variant="notification-row"
              divider
              icon={<FileText className="w-5 h-5" />}
              title="Bill Reminders"
              description="Get notified before bills are due"
              type="toggle"
              enabled={notifications.billReminders}
              onToggle={(val) =>
                setNotifications({ ...notifications, billReminders: val })
              }
            />
            <SettingsItem
              variant="notification-row"
              divider
              icon={<CheckCircle className="w-5 h-5" />}
              title="Payment Confirmations"
              description="Receive transaction confirmations"
              type="toggle"
              enabled={notifications.paymentConfirmations}
              onToggle={(val) =>
                setNotifications({
                  ...notifications,
                  paymentConfirmations: val,
                })
              }
            />
            <SettingsItem
              variant="notification-row"
              divider
              icon={<Zap className="w-5 h-5" />}
              title="Goal Progress Updates"
              description="Track savings goal milestones"
              type="toggle"
              enabled={notifications.goalUpdates}
              onToggle={(val) =>
                setNotifications({ ...notifications, goalUpdates: val })
              }
            />
            <SettingsItem
              variant="notification-row"
              icon={<AlertCircle className="w-5 h-5" />}
              title="Security Alerts"
              description="Important security notifications"
              type="toggle"
              enabled={notifications.securityAlerts}
              onToggle={(val) =>
                setNotifications({ ...notifications, securityAlerts: val })
              }
            />
          </SettingsSection>

          {/* <div className="px-4 mt-4 text-center">
            <p className="text-gray-500 text-xs">
              Notification preferences are saved locally and will persist across
              sessions.
            </p>
          </div> */}
        </div>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon={<Globe className="w-5 h-5" />}
            title="Currency Display"
            description="Primary currency for dashboard"
            type="text"
            value="USD ($)"
          />
          <SettingsItem
            icon={<MessageSquare className="w-5 h-5" />}
            title="Language"
            description="Default app language"
            type="text"
            value="English"
          />
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection title="Security">
          <SettingsItem
            icon={<Lock className="w-5 h-5" />}
            title="Transaction Signing"
            description="Always ask for signature"
            type="toggle"
            enabled={security.transactionSigning}
            onToggle={(val) =>
              setSecurity({ ...security, transactionSigning: val })
            }
          />
          <SettingsItem
            icon={<Clock className="w-5 h-5" />}
            title="Session Timeout"
            description="Automatically log out after inactivity"
            type="text"
            value="30 minutes"
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsItem
            icon={<Info className="w-5 h-5" />}
            title="App Version"
            type="text"
            value="v1.0.4-alpha"
          />
          <SettingsItem
            icon={<FileText className="w-5 h-5" />}
            title="Terms of Service"
            type="navigation"
          />
          <SettingsItem
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Privacy Policy"
            type="navigation"
          />
          <SettingsItem
            icon={<MessageSquare className="w-5 h-5" />}
            title="Support"
            type="navigation"
          />
        </SettingsSection>
      </div>
    </main>
  );
}
