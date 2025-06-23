"use client"

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
  fetchTrainingById,
  type Course,
} from "@/redux/api/trainingApiSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Loader2, AlertCircle, BookOpen, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { OTMSLoader } from "@/components/ui/otms-loader";
import Image from "next/image";

export function TrainingManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.trainings);
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    description: "",
    duration: 0,
    capacity: 0,
    startDate: "",
    endDate: "",
    location: "",
    isVirtual: false,
    virtualMeetingLink: "",
    accessibilityFeatures: [],
    prerequisites: [],
    tags: [],
    status: "scheduled"
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  useEffect(() => {
    dispatch(fetchTrainings());
  }, [dispatch]);

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate || !formData.location) {
      setFormError("Title, description, start date, end date, and location are required.");
      return false;
    }
    if (!formData.duration || !formData.capacity || formData.duration <= 0 || formData.capacity <= 0) {
      setFormError("Duration and capacity must be greater than 0.");
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setFormError("End date must be after start date.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setCreateLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Add course data
      const courseData = {
        ...formData,
        organization: "6814cafa297e8ab73f23f5fd", // Default organization ID
      };
      formDataToSend.append('training', JSON.stringify(courseData));

      // Add thumbnail if exists
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      await dispatch(createTraining({ formData: formDataToSend })).unwrap();
      setIsCreateDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        duration: 0,
        capacity: 0,
        startDate: "",
        endDate: "",
        location: "",
        isVirtual: false,
        virtualMeetingLink: "",
        accessibilityFeatures: [],
        prerequisites: [],
        tags: [],
        status: "scheduled"
      });
      handleRemoveImage();
      toast({ title: "Success", description: "Training created successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create training", variant: "destructive" });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    
    // Clear any existing thumbnail file state
    setThumbnailFile(null);
    
    // Format dates for datetime-local input (YYYY-MM-DDTHH:MM)
    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    };
    
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      capacity: course.capacity,
      startDate: formatDateForInput(course.startDate),
      endDate: formatDateForInput(course.endDate),
      location: course.location,
      isVirtual: course.isVirtual,
      virtualMeetingLink: course.virtualMeetingLink || "",
      accessibilityFeatures: course.accessibilityFeatures,
      prerequisites: course.prerequisites,
      tags: course.tags,
      status: course.status
    });
    
    // Set thumbnail preview if exists
    if (course.thumbnail?.url) {
      setThumbnailPreview(course.thumbnail.url);
    } else {
      setThumbnailPreview("");
    }
    
    setIsEditDialogOpen(true);
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    if (!validateForm()) return;
    setEditLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Add course data
      const courseData = {
        ...formData,
        organization: selectedCourse.organization,
      };
      formDataToSend.append('training', JSON.stringify(courseData));

      // Handle thumbnail logic
      if (thumbnailFile) {
        // New file uploaded
        formDataToSend.append('thumbnail', thumbnailFile);
      } else if (thumbnailPreview && !thumbnailPreview.startsWith('blob:')) {
        // Existing thumbnail (not a blob URL from new upload)
        // The backend should handle keeping the existing thumbnail
        console.log('Keeping existing thumbnail');
      }

      console.log('Updating training with data:', courseData);
      await dispatch(updateTraining({ id: selectedCourse._id, formData: formDataToSend })).unwrap();
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
      setFormData({
        title: "",
        description: "",
        duration: 0,
        capacity: 0,
        startDate: "",
        endDate: "",
        location: "",
        isVirtual: false,
        virtualMeetingLink: "",
        accessibilityFeatures: [],
        prerequisites: [],
        tags: [],
        status: "scheduled"
      });
      handleRemoveImage();
      toast({ title: "Success", description: "Training updated successfully." });
    } catch (error: any) {
      console.error('Error updating training:', error);
      toast({ title: "Error", description: error.message || "Failed to update training", variant: "destructive" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (courseId: string) => {
    setDeleteCourseId(courseId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (!deleteCourseId) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteTraining(deleteCourseId)).unwrap();
      toast({ title: "Success", description: "Training deleted successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete training", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteCourseId(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "scheduled": return "secondary";
      case "active": return "default";
      case "completed": return "outline";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  if (loading) return <OTMSLoader />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <BookOpen className="mr-2 h-4 w-4" /> Add Training
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Training</DialogTitle>
              <DialogDescription>Fill in the details to create a new training session.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title">Title</label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="status">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="duration">Duration (hours)</label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="capacity">Capacity</label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate">Start Date</label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDate">End Date</label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="location">Location</label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVirtual"
                  checked={formData.isVirtual}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVirtual: checked as boolean })}
                />
                <label htmlFor="isVirtual">Virtual Training</label>
              </div>

              {formData.isVirtual && (
                <div className="space-y-2">
                  <label htmlFor="virtualMeetingLink">Virtual Meeting Link</label>
                  <Input
                    id="virtualMeetingLink"
                    value={formData.virtualMeetingLink}
                    onChange={(e) => setFormData({ ...formData, virtualMeetingLink: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="thumbnail">Thumbnail</label>
                <div className="space-y-2">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        width={200}
                        height={150}
                        className="rounded border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                        onClick={() => document.getElementById('thumbnail')?.click()}
                      >
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload thumbnail
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Create Training
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>
                {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "N/A"}
              </TableCell>
              <TableCell>{course.duration}h</TableCell>
              <TableCell>{course.capacity}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(course.status)}>
                  {course.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(course.startDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(course)}
                    aria-label="Edit"
                  >
                    <Edit className="h-5 w-5 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(course._id)}
                    aria-label="Delete"
                  >
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Training</DialogTitle>
            <DialogDescription>Update the training details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-title">Title</label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-status">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-description">Description</label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-duration">Duration (hours)</label>
                <Input
                  id="edit-duration"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-capacity">Capacity</label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-startDate">Start Date</label>
                <Input
                  id="edit-startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-endDate">End Date</label>
                <Input
                  id="edit-endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-location">Location</label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isVirtual"
                checked={formData.isVirtual}
                onCheckedChange={(checked) => setFormData({ ...formData, isVirtual: checked as boolean })}
              />
              <label htmlFor="edit-isVirtual">Virtual Training</label>
            </div>

            {formData.isVirtual && (
              <div className="space-y-2">
                <label htmlFor="edit-virtualMeetingLink">Virtual Meeting Link</label>
                <Input
                  id="edit-virtualMeetingLink"
                  value={formData.virtualMeetingLink}
                  onChange={(e) => setFormData({ ...formData, virtualMeetingLink: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="edit-thumbnail">Thumbnail</label>
              <div className="space-y-2">
                {thumbnailPreview ? (
                  <div className="relative">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      width={200}
                      height={150}
                      className="rounded border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="edit-thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                      onClick={() => document.getElementById('edit-thumbnail')?.click()}
                    >
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload thumbnail
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Update Training
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
              Are you sure you want to delete this training? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button onClick={confirmDeleteCourse} disabled={deleteLoading} variant="destructive">
              {deleteLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 