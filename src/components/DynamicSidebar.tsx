"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, BookOpen, PenTool, Plus, Check } from "lucide-react";

interface Upload {
  id: string;
  type: "xiaohongshu" | "feishu" | "thoughts";
  title: string;
  content: string;
  uploadedAt: number;
  tags: string[];
}

interface DynamicSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFiles: (selectedIds: string[]) => void;
  onUploadNew: () => void;
}

export function DynamicSidebar({
  isOpen,
  onClose,
  onSelectFiles,
  onUploadNew,
}: DynamicSidebarProps) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchUploads();
    }
  }, [isOpen]);

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/uploads");
      const data = await res.json();
      setUploads(data.uploads || []);
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "xiaohongshu":
        return <FileText className="text-pink-500" />;
      case "feishu":
        return <BookOpen className="text-blue-500" />;
      case "thoughts":
        return <PenTool className="text-purple-500" />;
      default:
        return <FileText />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "xiaohongshu":
        return "小红书";
      case "feishu":
        return "飞书文档";
      case "thoughts":
        return "手写感悟";
      default:
        return type;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">历史数据</h2>
                <button
                  onClick={onClose}
                  className="nav-button !w-10 !h-10"
                >
                  <X size={18} className="text-gray-700" />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                选择已上传的数据进行匹配，或上传新数据
              </p>
            </div>

            {/* File list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="loading-spinner" />
                </div>
              ) : uploads.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>还没有上传任何数据</p>
                  <p className="text-sm mt-2">点击下方按钮开始上传</p>
                </div>
              ) : (
                uploads.map((upload) => {
                  const isChecked = selectedIds.includes(upload.id);
                  return (
                    <motion.div
                      key={upload.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => toggleSelect(upload.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        isChecked
                          ? "card-selected"
                          : "border-2 border-gray-200 hover:border-purple-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div className={`checkbox ${isChecked ? "checkbox-checked" : ""}`}>
                          {isChecked && <Check size={16} className="text-white" />}
                        </div>

                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(upload.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {getTypeLabel(upload.type)}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-800 mb-1 truncate">
                            {upload.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {upload.content.substring(0, 60)}...
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {upload.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="tag text-xs !py-0.5 !px-2">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(upload.uploadedAt).toLocaleDateString("zh-CN")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Bottom buttons */}
            <div className="p-6 border-t border-gray-200 space-y-3">
              {selectedIds.length > 0 && (
                <motion.button
                  onClick={() => onSelectFiles(selectedIds)}
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  使用已选数据匹配 ({selectedIds.length})
                </motion.button>
              )}

              <motion.button
                onClick={onUploadNew}
                className="btn-secondary w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={20} />
                上传新数据
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
