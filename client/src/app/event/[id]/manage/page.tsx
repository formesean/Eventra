"use client";

import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  FunnelIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

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

function StatusSelect({
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
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-500/20 focus:bg-purple-500/20 flex items-center justify-between ${option.color} transition-colors`}
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

export default function RSVPList() {
  const router = useRouter();
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("register-time");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventData, setEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "status" | "delete";
    rsvpId: number | null;
    newStatus: RSVP["status"] | null;
    attendeeName: string;
  }>({
    isOpen: false,
    type: "status",
    rsvpId: null,
    newStatus: null,
    attendeeName: "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventDataParam = urlParams.get("eventData");
    if (eventDataParam) {
      try {
        const parsedEventData = JSON.parse(decodeURIComponent(eventDataParam));
        setEventData(parsedEventData);
        fetchAttendees(parsedEventData.id);
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    }
  }, []);

  const fetchAttendees = async (eventId: number) => {
    try {
      const response = await fetch(`/api/attendee?eventId=${eventId}`);
      const data = await response.json();

      if (data.success && data.attendees) {
        setRSVPs(data.attendees);
      } else {
        console.error("Failed to fetch attendees:", data.error);
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRSVPs = rsvps
    .filter((rsvp) => {
      const matchesSearch =
        rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rsvp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || rsvp.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "register-time":
        default:
          return (
            new Date(b.rsvpDate).getTime() - new Date(a.rsvpDate).getTime()
          );
      }
    });

  const totalPages = Math.ceil(filteredRSVPs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRSVPs = filteredRSVPs.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getStatusDisplay = (status: RSVP["status"]) => {
    switch (status) {
      case "going":
        return { text: "Going", color: "text-green-400" };
      case "maybe":
        return { text: "Maybe", color: "text-yellow-400" };
      case "not-going":
        return { text: "Not Going", color: "text-gray-400" };
    }
  };

  const handleStatusChange = async (
    rsvpId: number,
    newStatus: RSVP["status"],
    attendeeName: string
  ) => {
    setConfirmDialog({
      isOpen: true,
      type: "status",
      rsvpId,
      newStatus,
      attendeeName,
    });
  };

  const handleDeleteClick = (rsvpId: number, attendeeName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      rsvpId,
      newStatus: null,
      attendeeName,
    });
  };

  const confirmAction = async () => {
    if (
      confirmDialog.type === "status" &&
      confirmDialog.rsvpId &&
      confirmDialog.newStatus
    ) {
      try {
        const response = await fetch("/api/attendee", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registrationId: confirmDialog.rsvpId,
            status: confirmDialog.newStatus,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update status");
        }

        // Update local state
        setRSVPs((prev) =>
          prev.map((rsvp) =>
            rsvp.id === confirmDialog.rsvpId
              ? {
                  ...rsvp,
                  status: confirmDialog.newStatus!,
                  lastUpdated: new Date().toISOString(),
                }
              : rsvp
          )
        );

        // Update event data counts
        if (eventData) {
          const oldStatus = rsvps.find(
            (r) => r.id === confirmDialog.rsvpId
          )?.status;
          if (oldStatus) {
            setEventData((prev: any) => ({
              ...prev,
              [`${oldStatus}Count`]: (prev[`${oldStatus}Count`] || 0) - 1,
              [`${confirmDialog.newStatus}Count`]:
                (prev[`${confirmDialog.newStatus}Count`] || 0) + 1,
            }));
          }
        }
      } catch (error) {
        console.error("Error updating status:", error);
        // You might want to show an error toast here
      }
    } else if (confirmDialog.type === "delete" && confirmDialog.rsvpId) {
      setRSVPs((prev) =>
        prev.filter((rsvp) => rsvp.id !== confirmDialog.rsvpId)
      );
    }

    setConfirmDialog({
      isOpen: false,
      type: "status",
      rsvpId: null,
      newStatus: null,
      attendeeName: "",
    });
  };

  const cancelAction = () => {
    setConfirmDialog({
      isOpen: false,
      type: "status",
      rsvpId: null,
      newStatus: null,
      attendeeName: "",
    });
  };

  const getRSVPCounts = () => {
    return {
      going: eventData?.goingCount || 0,
      maybe: eventData?.maybeCount || 0,
      notGoing: eventData?.notGoingCount || 0,
      total: eventData?.attendees || 0,
    };
  };

  const rsvpCounts = getRSVPCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="hover:cursor-pointer text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Event
            </Button>
          </div>
          <p className="text-[20px] text-gray-300">
            {eventData?.name || "Loading..."}
          </p>

          {/* RSVP Progress Bar */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl py-4 px-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                {rsvpCounts.total} total RSVPs
              </span>
            </div>

            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div
                    className="bg-green-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        rsvpCounts.total > 0
                          ? (rsvpCounts.going / rsvpCounts.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                  <div
                    className="bg-yellow-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        rsvpCounts.total > 0
                          ? (rsvpCounts.maybe / rsvpCounts.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                  <div
                    className="bg-red-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        rsvpCounts.total > 0
                          ? (rsvpCounts.notGoing / rsvpCounts.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">
                    Going ({rsvpCounts.going})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">
                    Maybe ({rsvpCounts.maybe})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">
                    Not Going ({rsvpCounts.notGoing})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search RSVPs..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-purple-500/50 transition-colors hover:cursor-pointer">
                <FunnelIcon className="h-4 w-4 mr-2 text-purple-400" />
                <SelectValue placeholder="All Guests" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/90 border-gray-700">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 hover:cursor-pointer"
                >
                  All Guests
                </SelectItem>
                <SelectItem
                  value="going"
                  className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 hover:cursor-pointer"
                >
                  Going
                </SelectItem>
                <SelectItem
                  value="maybe"
                  className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 hover:cursor-pointer"
                >
                  Maybe
                </SelectItem>
                <SelectItem
                  value="not-going"
                  className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 hover:cursor-pointer"
                >
                  Not Going
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 hover:border-purple-500/50 transition-colors hover:cursor-pointer">
                <ClockIcon className="h-4 w-4 mr-2 text-purple-400" />
                <SelectValue placeholder="Register Time" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/90 border-gray-700">
                <SelectItem
                  value="register-time"
                  className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 hover:cursor-pointer"
                >
                  Register Time
                </SelectItem>
                <SelectItem
                  value="name"
                  className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 hover:cursor-pointer"
                >
                  Name
                </SelectItem>
                <SelectItem
                  value="status"
                  className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20 hover:cursor-pointer"
                >
                  Status
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* RSVP List */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="py-4 px-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">RSVPs</h2>
              <span className="text-sm text-gray-400">
                {isLoading
                  ? "Loading..."
                  : `Showing ${startIndex + 1}-${Math.min(
                      endIndex,
                      filteredRSVPs.length
                    )} of ${filteredRSVPs.length}`}
              </span>
            </div>
          </div>

          {/* Scrollable List Container */}
          <div className="max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading attendees...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {currentRSVPs.map((rsvp) => {
                  const statusDisplay = getStatusDisplay(rsvp.status);
                  return (
                    <div
                      key={rsvp.id}
                      className="py-3 px-6 hover:bg-gray-800/20 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Avatar */}
                          <div
                            className={`w-7 h-7 rounded-full ${getAvatarColor(
                              rsvp.name
                            )} flex items-center justify-center`}
                          >
                            <span className="text-white text-[10px] font-medium">
                              {getInitials(rsvp.name)}
                            </span>
                          </div>

                          {/* Name and Email */}
                          <div className="flex justify-center items-center gap-2">
                            <h3 className="font-semibold text-white">
                              {rsvp.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {rsvp.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          {/* Status */}
                          <StatusSelect
                            currentStatus={rsvp.status}
                            onStatusChange={(newStatus) =>
                              handleStatusChange(rsvp.id, newStatus, rsvp.name)
                            }
                          />

                          {/* Date */}
                          <span className="text-gray-500 text-sm min-w-[100px] text-right">
                            {new Date(rsvp.rsvpDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>

                          {/* Remove button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDeleteClick(rsvp.id, rsvp.name)
                            }
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-2 hover:cursor-pointer"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-700 bg-gray-800/20">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="hover:cursor-pointer bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/70 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed h-8 px-3"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 h-8 px-3 hover:cursor-pointer"
                              : "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/70 hover:border-gray-500 h-8 px-3 hover:cursor-pointer"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="hover:cursor-pointer bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/70 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed h-8 px-3"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {filteredRSVPs.length === 0 && (
            <div className="p-12 text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                No RSVPs found
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter."
                  : "No one has RSVP'd yet."}
              </p>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.isOpen} onOpenChange={cancelAction}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>
                {confirmDialog.type === "status"
                  ? "Confirm RSVP Change"
                  : "Confirm Delete Attendee"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {confirmDialog.type === "status"
                  ? `Are you sure you want to change ${
                      confirmDialog.attendeeName
                    }'s RSVP status to "${
                      confirmDialog.newStatus &&
                      getStatusDisplay(confirmDialog.newStatus).text
                    }"?`
                  : `Are you sure you want to remove ${confirmDialog.attendeeName} from the RSVP list? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={cancelAction}
                className="border-gray-600 text-gray-300 hover:cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                className={
                  confirmDialog.type === "delete"
                    ? "bg-red-600 hover:bg-red-700 hover:cursor-pointer"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer"
                }
              >
                {confirmDialog.type === "status" ? "Confirm" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
