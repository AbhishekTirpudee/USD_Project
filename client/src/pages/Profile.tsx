import { useAuth } from "@/_core/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>

          <div className="bg-gray-900 rounded-lg p-8 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>

            {/* Account Info */}
            <div className="border-t border-gray-800 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-white font-semibold">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-800 pt-6">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-semibold flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
