"use client"

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { generateReport, exportAnalytics, fetchExports, getReportFiles, previewReportFile, downloadReportFile } from '@/redux/api/analyticsApiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  FileSpreadsheet,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import type { ReportFile } from '@/redux/api/analyticsApiSlice';

// --- ReportHistoryList Component ---

interface ReportHistoryListProps {
  reportFiles: any[];
  loading: boolean;
  error: string | null;
}

const ReportHistoryList: React.FC<ReportHistoryListProps> = ({ reportFiles, loading, error }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Handler for previewing a file using redux thunk
  const handlePreview = async (file: ReportFile) => {
    const resultAction = await dispatch(previewReportFile(file.filename));
    if (previewReportFile.fulfilled.match(resultAction)) {
      const blob = resultAction.payload;
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    } else {
      toast({ title: 'Preview Error', description: resultAction.payload || 'File not found or cannot preview', variant: 'destructive' });
    }
  };

  // Handler for downloading a file using redux thunk
  const handleDownload = async (file: ReportFile) => {
    const resultAction = await dispatch(downloadReportFile(file.filename));
    if (downloadReportFile.fulfilled.match(resultAction)) {
      const blob = resultAction.payload;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } else {
      toast({ title: 'Download Error', description: resultAction.payload || 'File not found or cannot download', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Export History</span>
          <Badge variant="outline">
            {(reportFiles && reportFiles.length) || 0} files
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading reports...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error loading reports: {error}</div>
        ) : reportFiles && reportFiles.length > 0 ? (
          <div className="space-y-4">
            {reportFiles.map((exportItem, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {/* getFileIcon(exportItem.filename) can be added here if desired */}
                  <div>
                    <h4 className="font-medium">{exportItem.filename}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exportItem.size} bytes • Created {new Date(exportItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(exportItem)}
                  >
                    Download
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePreview(exportItem)}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">No reports found.</div>
        )}
      </CardContent>
    </Card>
  );
};

export const ExportPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { exports, reportFiles, loading } = useSelector((state: RootState) => state.analytics);
  
  const [reportType, setReportType] = useState('enrollment');
  const [dataType, setDataType] = useState('enrollments');
  const [format, setFormat] = useState('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    dispatch(getReportFiles());
  }, [dispatch]);

  const handleGenerateReport = async () => {
    if (!reportType || !format || !startDate || !endDate) {
      toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const params = {
        reportType,
        format,
        startDate,
        endDate,
        courseId: courseId || undefined,
        organizationId: organizationId || undefined,
        includeCharts,
        includeTables: true,
      };
      const response = await dispatch(generateReport(params)).unwrap();
      toast({ title: "Report Generated", description: "Your report has been generated successfully." });
      // Refresh report files list
      dispatch(getReportFiles());
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate report", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportData = async () => {
    if (!dataType || !format || !startDate || !endDate) {
      toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setIsExporting(true);
    try {
      const params = {
        dataType,
        format,
        startDate,
        endDate,
        courseId: courseId || undefined,
        organizationId: organizationId || undefined,
        includeCharts,
      };
      const response = await dispatch(exportAnalytics(params)).unwrap();
      toast({ title: "Data Exported", description: "Your data has been exported successfully." });
      if (response.data && response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      }
      // Refresh export history
      dispatch(fetchExports());
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to export data", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    if (filename.includes('.csv') || filename.includes('.xlsx')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    }
    if (filename.includes('.pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Generate Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enrollment">Enrollment Report</SelectItem>
                  <SelectItem value="completion">Completion Report</SelectItem>
                  <SelectItem value="feedback">Feedback Report</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start date"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Training ID (Optional)</Label>
            <Input
              id="courseId"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="Filter by training"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organizationId">Organization ID (Optional)</Label>
              <Input
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                placeholder="Filter by organization"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeCharts"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="includeCharts">Include charts and visualizations</Label>
          </div>

          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating || !reportType || !format || !startDate || !endDate}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataType">Data Type</Label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enrollments">Enrollments</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="certificates">Certificates</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exportFormat">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleExportData} 
            disabled={isExporting || !dataType || !format || !startDate || !endDate}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Exporting Data...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Export History */}
      <ReportHistoryList reportFiles={reportFiles} loading={loading} error={null} />
    </div>
  );
}; 