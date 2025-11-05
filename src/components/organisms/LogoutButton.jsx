import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { useAuth } from "@/layouts/Root";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <motion.button
      onClick={logout}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-200 w-full text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <ApperIcon name="LogOut" size={16} />
      Logout
    </motion.button>
  );
}