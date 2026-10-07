"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Check, HelpCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type DialogType = "alert" | "confirm" | "prompt";

interface DialogConfig {
  id: string;
  type: DialogType;
  message: string;
  defaultValue?: string;
  resolve: (value: any) => void;
}

let dialogCounter = 0;
let addDialogCallback: ((config: DialogConfig) => void) | null = null;

export const Dialog = {
  alert: (message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (addDialogCallback) {
        addDialogCallback({ id: `dialog-${++dialogCounter}`, type: "alert", message, resolve });
      } else {
        window.alert(message);
        resolve();
      }
    });
  },
  confirm: (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (addDialogCallback) {
        addDialogCallback({ id: `dialog-${++dialogCounter}`, type: "confirm", message, resolve });
      } else {
        resolve(window.confirm(message));
      }
    });
  },
  prompt: (message: string, defaultValue?: string): Promise<string | null> => {
    return new Promise((resolve) => {
      if (addDialogCallback) {
        addDialogCallback({ id: `dialog-${++dialogCounter}`, type: "prompt", message, defaultValue, resolve });
      } else {
        resolve(window.prompt(message, defaultValue));
      }
    });
  }
};

export function DialogRenderer() {
  const [dialogs, setDialogs] = useState<DialogConfig[]>([]);
  const [mounted, setMounted] = useState(false);
  const [promptInput, setPromptInput] = useState("");

  useEffect(() => {
    setMounted(true);
    addDialogCallback = (config) => {
      if (config.type === "prompt") {
        setPromptInput(config.defaultValue || "");
      }
      setDialogs((prev) => [...prev, config]);
    };

    // Override native window popups globally
    if (typeof window !== "undefined") {
      window.alert = (message?: any) => {
        Dialog.alert(String(message));
      };
      // We don't override window.confirm or window.prompt globally because 
      // they are synchronous and our Dialog returns Promises, which would break 
      // code expecting a synchronous return value. But alert() returns undefined anyway.
    }

    return () => {
      addDialogCallback = null;
    };
  }, []);

  const handleResolve = (id: string, value: any) => {
    setDialogs((prev) => {
      const dialog = prev.find((d) => d.id === id);
      if (dialog) dialog.resolve(value);
      return prev.filter((d) => d.id !== id);
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {dialogs.map((dialog, index) => {
        // Only show the top-most dialog to avoid overlapping messes
        if (index !== dialogs.length - 1) return null;

        const isAlert = dialog.type === "alert";
        const isConfirm = dialog.type === "confirm";
        const isPrompt = dialog.type === "prompt";

        return (
          <div key={dialog.id} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {isAlert ? (
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <Info className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {isAlert ? "Informasi" : isConfirm ? "Konfirmasi" : "Masukkan Data"}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {dialog.message}
                </p>

                {isPrompt && (
                  <input
                    type="text"
                    autoFocus
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleResolve(dialog.id, promptInput);
                      if (e.key === "Escape") handleResolve(dialog.id, null);
                    }}
                    className="w-full px-4 py-2.5 mb-6 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                )}

                <div className="flex justify-end gap-3">
                  {!isAlert && (
                    <button
                      onClick={() => handleResolve(dialog.id, isConfirm ? false : null)}
                      className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    onClick={() => handleResolve(dialog.id, isPrompt ? promptInput : true)}
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                  >
                    {isAlert ? "Mengerti" : "Lanjutkan"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </AnimatePresence>,
    document.body
  );
}
