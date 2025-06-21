import { Loader2 } from "lucide-react";

export const OTMSLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
    <span className="text-lg font-semibold text-primary">Loading OTMS...</span>
  </div>
); 