import React, { useState } from "react";
import {
  BookOpen,
  User,
  Calendar,
  MapPin,
  Users,
  Accessibility,
  X,
  BarChart3,
  MessageCircle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EnrollmentsStats from "./EnrollmentsStats";
import FeedbacksList from "./FeedbacksList";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface TrainingDetailsModalProps {
  training: any;
  onClose: () => void;
}

const TrainingDetailsModal: React.FC<TrainingDetailsModalProps> = ({ training, onClose }) => {
  const [tab, setTab] = useState("enrollments");
  const enrollmentStats = useSelector((state: RootState) => state.analytics.enrollmentStats);
  const courseFeedbacks = useSelector((state: RootState) => state.feedback.courseFeedbacks);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-3xl h-[95vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in border border-black/10 dark:border-white/10">
        <button
          className="absolute top-6 right-6 text-3xl font-bold text-gray-400 hover:text-gray-700 dark:hover:text-white z-10 bg-white/80 dark:bg-slate-900/80 rounded-full p-2 shadow-lg"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-7 h-7" />
        </button>
        <Tabs defaultValue="enrollments" value={tab} onValueChange={setTab} className="flex flex-col h-full">
          <div className="overflow-y-auto p-8 flex-1 flex flex-col gap-8">
            {/* Thumbnail and Title */}
            {training.thumbnail?.url && (
              <img
                src={training.thumbnail.url}
                alt={training.title}
                className="w-full h-48 object-cover rounded-lg mb-4 shadow border border-black/10 dark:border-white/10"
              />
            )}
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{training.title}</h2>
            </div>
            <p className="mb-6 text-muted-foreground text-base border-b pb-4">{training.description}</p>
            {/* Instructor & Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border rounded p-2">
                <User className="w-5 h-5 text-primary" />
                <span className="font-medium">Instructor:</span>
                <span>{training.instructor?.firstName} {training.instructor?.lastName}</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border rounded p-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">Start:</span>
                <span>{new Date(training.startDate).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border rounded p-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">End:</span>
                <span>{new Date(training.endDate).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border rounded p-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium">Location:</span>
                {training.isVirtual ? (
                  <a href={training.virtualMeetingLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">Virtual Link</a>
                ) : (
                  <span>{training.location}</span>
                )}
              </div>
            </div>
            {/* Capacity & Accessibility */}
            <div className="flex flex-col md:flex-row gap-4 border-t pt-4">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border rounded p-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Capacity:</span>
                <span>{training.capacity}</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border rounded p-2">
                <Accessibility className="w-5 h-5 text-primary" />
                <span className="font-medium">Accessibility:</span>
                <span>{training.accessibilityFeatures?.join(", ") || "None"}</span>
              </div>
            </div>
            {/* Tabs Triggers Below Details */}
            <TabsList className="flex justify-center mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 gap-4">
              <TabsTrigger value="enrollments" className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="w-5 h-5" /> Enrollments
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-white dark:bg-primary/80">{enrollmentStats?.totalEnrolled ?? 0}</span>
              </TabsTrigger>
              <TabsTrigger value="feedbacks" className="flex items-center gap-2 text-lg font-semibold">
                <MessageCircle className="w-5 h-5" /> Feedbacks
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-white dark:bg-primary/80">{courseFeedbacks?.length ?? 0}</span>
              </TabsTrigger>
            </TabsList>
            {/* Tab Content */}
            <TabsContent value="enrollments" className="flex-1 flex flex-col gap-8">
              <EnrollmentsStats courseId={training._id} compact />
            </TabsContent>
            <TabsContent value="feedbacks" className="flex-1 flex flex-col gap-8">
              <FeedbacksList courseId={training._id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainingDetailsModal; 