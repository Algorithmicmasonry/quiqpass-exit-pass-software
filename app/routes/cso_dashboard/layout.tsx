import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import { Outlet } from "react-router";
import CustomSidebar from "~/components/global/custom-sidebar";
import { SidebarFeedbackForm } from "~/components/global/sidebar-form";
import { NavMain } from "~/components/nav-main";
// TODO: Implement feedback sending through sidebar feedback form

const CSODashboardLayout = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    photo_url: "",
    role: "",
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const gradientStyle = {
    background: "radial-gradient(125% 125% at 50% 10%,#ffffff 40%,#a78bfa 100%",
  };

  const data = {
    user: {
      name: profile.first_name + " " + profile.last_name,
      email: profile.email,
      avatar: profile.photo_url || undefined,
      unread: unreadCount > 0 ? unreadCount : undefined,
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/cso-dashboard",
        icon: IconDashboard,
        route: "cso-dashboard",
      },
      {
        title: "Pass Requests",
        url: "/cso-dashboard/pass-requests",
        icon: IconListDetails,
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "#",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "#",
        icon: IconSearch,
      },
    ],
    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: IconDatabase,
      },
      {
        name: "Reports",
        url: "#",
        icon: IconReport,
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: IconFileWord,
      },
    ],
  };

  return (
    <div className="min-h-screen relative" suppressHydrationWarning>
      {/* Main Gradient Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
        }}
      />

      {/* Sidebar and content */}
      <div className="relative z-10">
        <CustomSidebar gradientStyle={gradientStyle}>
          <NavMain items={data.navMain} />
          <SidebarFeedbackForm route="CS0" />
          {/* <NavUser user={data.user} /> */}
        </CustomSidebar>

        {/* Content Area - Add left margin to push it away from fixed sidebar */}
        <div className="ml-0 md:ml-64 min-h-screen">
          <div className="p-[24px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSODashboardLayout;
