import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Edit, X } from "lucide-react";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState({
    name: "Ashraf",
    email: "ashraf@example.com",
    phone: "+91-9876543210",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    // <SidebarLayout>
    <motion.div
      className="max-w-3xl mx-auto p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Profile Management
      </h1>

      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl space-y-6 border dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-indigo-500 shadow"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {profile.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Full Stack Developer</p>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-700" />

        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all duration-300"
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md space-y-4 relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    // </SidebarLayout>
  );
};

export default Profile;