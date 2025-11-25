import React from "react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDangerous?: boolean;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    isDangerous = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <h2 id="dialog-title" className="text-xl font-bold text-neutral-900 mb-3">
                    {title}
                </h2>
                <p className="text-neutral-600 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md font-medium hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 transition-all active:scale-[0.97]">
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all active:scale-[0.97] ${
                            isDangerous
                                ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                        }`}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
