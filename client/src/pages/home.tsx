import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import RegistrationModal from "@/components/modals/RegistrationModal";
import UserProfileModal from "@/components/modals/UserProfileModal";
import SettingsModal from "@/components/modals/SettingsModal";
import MemoModal from "@/components/modals/MemoModal";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedRoomId, setSelectedRoomId] = useState<string>("global-1");
  const [showRegistration, setShowRegistration] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMemo, setShowMemo] = useState(false);

  // Check if user needs to complete registration
  useEffect(() => {
    if (user && (!user.username || !user.country || !user.language)) {
      setShowRegistration(true);
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mikan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ChatSidebar
            selectedRoomId={selectedRoomId}
            onRoomSelect={setSelectedRoomId}
            onSettingsClick={() => setShowSettings(true)}
            onProfileClick={() => setShowProfile(true)}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1">
          <ChatArea
            roomId={selectedRoomId}
            onUserClick={() => setShowProfile(true)}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation - smaller and less intrusive */}
      <div className="lg:hidden">
        <MobileBottomNav
          onMemoClick={() => setShowMemo(true)}
          onProfileClick={() => setShowProfile(true)}
        />
      </div>

      {/* Add bottom padding for mobile to account for nav bar */}
      <div className="lg:hidden h-12"></div>

      {/* Modals */}
      <RegistrationModal
        open={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
      
      <UserProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
      />
      
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <MemoModal
        open={showMemo}
        onClose={() => setShowMemo(false)}
      />
    </div>
  );
}
