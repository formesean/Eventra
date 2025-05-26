import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CheckIcon } from "@heroicons/react/24/outline";

interface RSVP {
  id: number;
  name: string;
  email: string;
  status: "going" | "maybe" | "not-going";
  rsvpDate: string;
  lastUpdated?: string;
}

interface StatusSelectProps {
  currentStatus: RSVP["status"];
  onStatusChange: (status: RSVP["status"]) => void;
  className?: string;
}

export function StatusSelect({
  currentStatus,
  onStatusChange,
  className = "",
}: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const statusOptions: {
    value: RSVP["status"];
    label: string;
    color: string;
  }[] = [
    { value: "going", label: "Going", color: "text-green-400" },
    { value: "maybe", label: "Maybe", color: "text-yellow-400" },
    { value: "not-going", label: "Not Going", color: "text-gray-400" },
  ];

  const currentStatusOption = statusOptions.find(
    (opt) => opt.value === currentStatus
  );

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow >= 120 ? rect.bottom + 8 : rect.top - 120;

      setPosition({
        top,
        left: rect.left,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            updatePosition();
          }
        }}
        className={`${currentStatusOption?.color} hover:opacity-80 transition-opacity text-sm font-medium hover:cursor-pointer px-2 rounded-full border border-current ${className}`}
      >
        {currentStatusOption?.label}
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed z-50"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <div
              className="w-48 rounded-xl shadow-lg bg-gray-800/90 backdrop-blur-sm border border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onStatusChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`hover:cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-purple-500/20 focus:bg-purple-500/20 flex items-center justify-between ${option.color} transition-colors`}
                  >
                    <span className="font-medium">{option.label}</span>
                    {currentStatus === option.value && (
                      <CheckIcon className="h-4 w-4 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />,
          document.body
        )}
    </div>
  );
}
