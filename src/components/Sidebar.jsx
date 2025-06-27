import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, MessageSquare, Trash2 } from "lucide-react";

import logo from "../assets/logo/logoblackbg.png";
export default function Sidebar({ isOpen, setIsOpen, chatHistory }) {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 20 }}
        className={`fixed inset-y-0 left-0 w-72 bg-green-200 text-white p-4 z-30
          lg:static lg:transform-none ${isOpen ? "" : "lg:translate-x-0"}`}
      >
        {" "}
        <img src={logo} />
        {/* Header */}
        {/* Chat List */}
        {/* <div className="space-y-2">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer group"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="flex-1 truncate">{chat.title}</span>
              <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div> */}
      </motion.div>
    </>
  );
}
