"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Upload, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { useAuth } from "@/lib/hooks/useAuth"

interface Training {
    title: string
    description: string
    thumbnail: {
        public_id: string
        url: string
    }
    duration: number
    capacity: number
    startDate: string
    endDate: string
    location: string
    isVirtual: boolean
    virtualMeetingLink?: string
    accessibilityFeatures: string[]
    organization: string
    materials: {
        title: string
        fileUrl: string
        fileType: string
        uploadDate: string
    }[]
    prerequisites: string[]
    tags: string[]
}

interface CreateTrainingDialogProps {
    onCreateTraining: (newTraining: Omit<Training, "_id" | "instructor" | "status" | "createdAt">, thumbnailFile?: File) => void
}

export function CreateTrainingDialog({ onCreateTraining }: CreateTrainingDialogProps) {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState("")
    const [formData, setFormData] = useState<Training>({
        title: "",
        description: "",
        thumbnail: {
            public_id: "",
            url: ""
        },
        duration: 0,
        capacity: 0,
        startDate: "",
        endDate: "",
        location: "",
        isVirtual: false,
        virtualMeetingLink: "",
        accessibilityFeatures: [],
        organization: user?.organization || "6814cafa297e8ab73f23f5fd",
        materials: [],
        prerequisites: [],
        tags: []
    })

    useEffect(() => {
        if (user?.organization) {
            setFormData(prev => ({
                ...prev,
                organization: user.organization 
            }));
        }
    }, [user]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setThumbnailFile(file)
        const previewUrl = URL.createObjectURL(file)
        setThumbnailPreview(previewUrl)
    }

    const handleRemoveImage = () => {
        setThumbnailFile(null)
        setThumbnailPreview("")
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)
        try {
            await onCreateTraining(formData, thumbnailFile || undefined)
            setOpen(false)
            setFormData({
                title: "",
                description: "",
                thumbnail: {
                    public_id: "",
                    url: ""
                },
                duration: 0,
                capacity: 0,
                startDate: "",
                endDate: "",
                location: "",
                isVirtual: false,
                virtualMeetingLink: "",
                accessibilityFeatures: [],
                organization: user?.organization || "",
                materials: [],
                prerequisites: [],
                tags: []
            })
            handleRemoveImage()
        } catch (error) {
            console.error('Error creating training:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            isVirtual: checked,
        }))
    }

    const handleAccessibilityFeatures = (e: React.ChangeEvent<HTMLInputElement>) => {
        const feature = e.target.value
        setFormData((prev) => ({
            ...prev,
            accessibilityFeatures: prev.accessibilityFeatures.includes(feature)
                ? prev.accessibilityFeatures.filter(f => f !== feature)
                : [...prev.accessibilityFeatures, feature]
        }))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <BookOpen className="mr-2 h-4 w-4" /> Create Training
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Training</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new training session.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="title" className="text-right">
                                Title
                            </label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="description" className="text-right">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <label htmlFor="thumbnail" className="text-right pt-2">
                                Thumbnail
                            </label>
                            <div className="col-span-3 space-y-4">
                                {thumbnailPreview ? (
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={thumbnailPreview}
                                            alt="Training thumbnail preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                        >
                                            <X className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Input
                                            id="thumbnail"
                                            name="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            required
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="duration" className="text-right">
                                Duration (hours)
                            </label>
                            <Input
                                id="duration"
                                name="duration"
                                type="number"
                                min="0"
                                step="0.5"
                                value={formData.duration}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="capacity" className="text-right">
                                Capacity
                            </label>
                            <Input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="1"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="startDate" className="text-right">
                                Start Date
                            </label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="datetime-local"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="endDate" className="text-right">
                                End Date
                            </label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Virtual Training?</div>
                            <div className="col-span-3 flex items-center space-x-2">
                                <Checkbox
                                    id="isVirtual"
                                    checked={formData.isVirtual}
                                    onCheckedChange={handleCheckboxChange}
                                />
                                <label htmlFor="isVirtual">
                                    This is a virtual training
                                </label>
                            </div>
                        </div>
                        {formData.isVirtual && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="virtualMeetingLink" className="text-right">
                                    Meeting Link
                                </label>
                                <Input
                                    id="virtualMeetingLink"
                                    name="virtualMeetingLink"
                                    type="url"
                                    value={formData.virtualMeetingLink}
                                    onChange={handleChange}
                                    className="col-span-3"
                                    required={formData.isVirtual}
                                />
                            </div>
                        )}
                        {!formData.isVirtual && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="location" className="text-right">
                                    Location
                                </label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="col-span-3"
                                    required={!formData.isVirtual}
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <label className="text-right pt-2">
                                Accessibility Features
                            </label>
                            <div className="col-span-3 space-y-2">
                                {["Sign Language", "Closed Captions", "Screen Reader Support", "High Contrast", "Transcripts"].map((feature) => (
                                    <div key={feature} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={feature}
                                            value={feature}
                                            checked={formData.accessibilityFeatures.includes(feature)}
                                            onCheckedChange={() => {
                                                const e = { target: { value: feature } } as React.ChangeEvent<HTMLInputElement>
                                                handleAccessibilityFeatures(e)
                                            }}
                                        />
                                        <label htmlFor={feature}>{feature}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={uploading}>Create Training</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}