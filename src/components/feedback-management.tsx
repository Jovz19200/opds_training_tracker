"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchFeedbacks,
  updateFeedback,
  deleteFeedback,
  type Feedback,
} from "@/redux/api/feedbackApiSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Loader2, AlertCircle } from "lucide-react";
import { OTMSLoader } from "@/components/ui/otms-loader";

export function FeedbackManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { feedbacks, loading, error } = useSelector((state: RootState) => state.feedback);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [formData, setFormData] = useState<{ comment: string; rating: number }>({ comment: "", rating: 1 });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteFeedbackId, setDeleteFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const handleEditClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setFormData({ comment: feedback.comment, rating: feedback.rating });
    setIsEditDialogOpen(true);
  };

  const handleUpdateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedback) return;
    setEditLoading(true);
    try {
      await dispatch(updateFeedback({ id: selectedFeedback._id, feedback: formData })).unwrap();
      setIsEditDialogOpen(false);
      setSelectedFeedback(null);
      toast({ title: "Success", description: "Feedback updated." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update feedback", variant: "destructive" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (feedbackId: string) => {
    setDeleteFeedbackId(feedbackId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteFeedback = async () => {
    if (!deleteFeedbackId) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteFeedback(deleteFeedbackId)).unwrap();
      toast({ title: "Success", description: "Feedback deleted." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete feedback", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteFeedbackId(null);
    }
  };

  if (loading) return <OTMSLoader />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Feedback Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((fb) => (
            <TableRow key={fb._id}>
              <TableCell>{fb.courseId}</TableCell>
              <TableCell>{fb.userId}</TableCell>
              <TableCell>{fb.comment}</TableCell>
              <TableCell>{fb.rating}</TableCell>
              <TableCell>{new Date(fb.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(fb)} aria-label="Edit">
                    <Edit className="h-5 w-5 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(fb._id)} aria-label="Delete">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-destructive"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Feedback</DialogTitle>
            <DialogDescription>Update the feedback details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateFeedback} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-comment">Comment</label>
              <Input
                id="edit-comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-rating">Rating</label>
              <Input
                id="edit-rating"
                type="number"
                min={1}
                max={5}
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Update Feedback
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Confirm Delete
              </div>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button onClick={confirmDeleteFeedback} disabled={deleteLoading} variant="destructive">
              {deleteLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 