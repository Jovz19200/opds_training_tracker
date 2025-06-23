import React, { useEffect, useState } from "react";
import { MessageCircle, AlertCircle, User, Star, Calendar, MessageSquare, ThumbsUp, ThumbsDown, EyeOff } from "lucide-react";
import OTMSLoader from "./OTMSLoader";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchCourseFeedbacks, submitCourseFeedback } from "@/redux/api/feedbackApiSlice";
import { Button } from "@/components/ui/button";

interface FeedbacksListProps {
  courseId: string;
}

const initialForm = {
  overallRating: 0,
  contentRating: 0,
  instructorRating: 0,
  facilitiesRating: 0,
  accessibilityRating: 0,
  commentContent: "",
  commentInstructor: "",
  commentGeneral: "",
  suggestions: "",
  isAnonymous: false,
};

const FeedbacksList: React.FC<FeedbacksListProps> = ({ courseId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { courseFeedbacks, courseFeedbacksLoading, courseFeedbacksError, submitFeedbackLoading, submitFeedbackError, submitFeedbackSuccess } = useSelector((state: RootState) => state.feedback);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseFeedbacks({ courseId }));
    }
  }, [dispatch, courseId]);

  useEffect(() => {
    if (submitFeedbackSuccess) {
      setShowModal(false);
      setForm(initialForm);
      setStep(0);
      dispatch(fetchCourseFeedbacks({ courseId }));
    }
  }, [submitFeedbackSuccess, dispatch, courseId]);

  const handleChange = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(submitCourseFeedback({ courseId, feedback: form }));
  };

  // Star rating component
  const StarRating = ({ value }: { value: number }) => (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={i <= value ? 'currentColor' : 'none'} />)}
    </span>
  );

  if (courseFeedbacksLoading) return <div className="flex justify-center items-center h-32"><OTMSLoader /></div>;
  if (courseFeedbacksError) return <div className="flex items-center gap-2 text-destructive"><AlertCircle className="w-5 h-5" /> {courseFeedbacksError}</div>;
  if (!courseFeedbacks.length && !showModal) return <div className="text-muted-foreground text-center">No feedbacks yet.<div className='mt-4 flex justify-center'><Button className='w-full max-w-xs' onClick={() => setShowModal(true)}>Add Feedback</Button></div></div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        {courseFeedbacks.map((fb) => (
          <div
            key={fb._id}
            className="flex items-start gap-3 bg-white dark:bg-slate-800 border rounded p-3 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            onClick={() => setSelectedFeedback(fb)}
          >
            <User className="w-6 h-6 text-primary mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{fb.user.firstName} {fb.user.lastName}</span>
                <span className="text-xs text-muted-foreground">{new Date(fb.submissionDate).toLocaleDateString()}</span>
                <StarRating value={fb.overallRating} />
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">{fb.commentGeneral || fb.commentContent || fb.commentInstructor || fb.suggestions}</div>
            </div>
          </div>
        ))}
      </div>
      <Button className="mt-4 w-full max-w-xs self-center" onClick={() => setShowModal(true)}>
        Add Feedback
      </Button>
      {/* Feedback Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in border border-black/10 dark:border-white/10">
            <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={() => setShowModal(false)}>&times;</button>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Rate the Training</h2>
                  <label className="block mb-2 font-medium">Overall Rating</label>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <button type="button" key={i} onClick={() => handleChange('overallRating', i)}>
                        <Star className={`w-7 h-7 ${i <= form.overallRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={i <= form.overallRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <label className="block mb-2 font-medium">Content Rating</label>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <button type="button" key={i} onClick={() => handleChange('contentRating', i)}>
                        <Star className={`w-5 h-5 ${i <= form.contentRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={i <= form.contentRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <label className="block mb-2 font-medium">Instructor Rating</label>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <button type="button" key={i} onClick={() => handleChange('instructorRating', i)}>
                        <Star className={`w-5 h-5 ${i <= form.instructorRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={i <= form.instructorRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <label className="block mb-2 font-medium">Facilities Rating</label>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <button type="button" key={i} onClick={() => handleChange('facilitiesRating', i)}>
                        <Star className={`w-5 h-5 ${i <= form.facilitiesRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={i <= form.facilitiesRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <label className="block mb-2 font-medium">Accessibility Rating</label>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <button type="button" key={i} onClick={() => handleChange('accessibilityRating', i)}>
                        <Star className={`w-5 h-5 ${i <= form.accessibilityRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={i <= form.accessibilityRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button type="button" onClick={handleNext} disabled={form.overallRating === 0 || form.contentRating === 0 || form.instructorRating === 0 || form.facilitiesRating === 0 || form.accessibilityRating === 0}>Next</Button>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="max-h-80 overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">Your Feedback</h2>
                  <label className="block mb-1 font-medium">General Comment</label>
                  <textarea className="w-full border rounded p-1 mb-2 text-sm resize-none" value={form.commentGeneral} onChange={e => handleChange('commentGeneral', e.target.value)} rows={2} maxLength={300} />
                  <label className="block mb-1 font-medium">Content Comment</label>
                  <textarea className="w-full border rounded p-1 mb-2 text-sm resize-none" value={form.commentContent} onChange={e => handleChange('commentContent', e.target.value)} rows={2} maxLength={300} />
                  <label className="block mb-1 font-medium">Instructor Comment</label>
                  <textarea className="w-full border rounded p-1 mb-2 text-sm resize-none" value={form.commentInstructor} onChange={e => handleChange('commentInstructor', e.target.value)} rows={2} maxLength={300} />
                  <label className="block mb-1 font-medium">Suggestions</label>
                  <textarea className="w-full border rounded p-1 mb-2 text-sm resize-none" value={form.suggestions} onChange={e => handleChange('suggestions', e.target.value)} rows={2} maxLength={300} />
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id="isAnonymous" checked={form.isAnonymous} onChange={e => handleChange('isAnonymous', e.target.checked)} />
                    <label htmlFor="isAnonymous" className="text-sm">Submit as anonymous</label>
                  </div>
                  <div className="flex justify-between gap-2 mt-4">
                    <Button type="button" variant="secondary" onClick={handleBack}>Back</Button>
                    <Button type="submit" disabled={submitFeedbackLoading}>{submitFeedbackLoading ? "Submitting..." : "Submit"}</Button>
                  </div>
                  {submitFeedbackError && <div className="text-destructive text-center mt-2 flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" />{submitFeedbackError}</div>}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {/* Feedback Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in border border-black/10 dark:border-white/10">
            <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={() => setSelectedFeedback(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" /> Feedback Details
            </h2>
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-primary" />
              <span className="font-medium">User:</span>
              <span>{selectedFeedback.isAnonymous ? <><EyeOff className="w-4 h-4 inline text-muted-foreground mr-1" />Anonymous</> : `${selectedFeedback.user.firstName} ${selectedFeedback.user.lastName}`}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">Date:</span>
              <span>{new Date(selectedFeedback.submissionDate).toLocaleString()}</span>
            </div>
            <div className="border-t my-4" />
            <div className="mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">Overall Rating:</span>
              <StarRating value={selectedFeedback.overallRating} />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /><span className="font-medium">Content:</span> <StarRating value={selectedFeedback.contentRating} /></div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /><span className="font-medium">Instructor:</span> <StarRating value={selectedFeedback.instructorRating} /></div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /><span className="font-medium">Facilities:</span> <StarRating value={selectedFeedback.facilitiesRating} /></div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /><span className="font-medium">Accessibility:</span> <StarRating value={selectedFeedback.accessibilityRating} /></div>
            </div>
            <div className="border-t my-4" />
            <div className="mb-2 flex items-start gap-2"><MessageSquare className="w-5 h-5 text-primary mt-0.5" /><span className="font-medium">General Comment:</span> <span>{selectedFeedback.commentGeneral || <span className='text-muted-foreground'>None</span>}</span></div>
            <div className="mb-2 flex items-start gap-2"><MessageSquare className="w-5 h-5 text-primary mt-0.5" /><span className="font-medium">Content Comment:</span> <span>{selectedFeedback.commentContent || <span className='text-muted-foreground'>None</span>}</span></div>
            <div className="mb-2 flex items-start gap-2"><MessageSquare className="w-5 h-5 text-primary mt-0.5" /><span className="font-medium">Instructor Comment:</span> <span>{selectedFeedback.commentInstructor || <span className='text-muted-foreground'>None</span>}</span></div>
            <div className="mb-2 flex items-start gap-2"><ThumbsUp className="w-5 h-5 text-green-500 mt-0.5" /><span className="font-medium">Suggestions:</span> <span>{selectedFeedback.suggestions || <span className='text-muted-foreground'>None</span>}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbacksList; 