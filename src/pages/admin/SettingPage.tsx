import React from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { AdminLayout } from "../../shared/components/layout/AdminLayout";

const AdminSettingPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-slate-600 rounded-2xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Configure your system preferences</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              This is Settings Page
            </h2>
            <p className="text-gray-600">Configuration options coming soon</p>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingPage;
