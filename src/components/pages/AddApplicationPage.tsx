import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { JobApplications } from '@/entities';

export default function AddApplicationPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    applicationDate: new Date().toISOString().split('T')[0],
    applicationStatus: 'Applied',
    companyResponse: '',
    jobPostingUrl: '',
    jobLocation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newApplication: JobApplications = {
        _id: crypto.randomUUID(),
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        applicationDate: formData.applicationDate,
        applicationStatus: formData.applicationStatus,
        companyResponse: formData.companyResponse || undefined,
        jobPostingUrl: formData.jobPostingUrl || undefined,
        jobLocation: formData.jobLocation || undefined,
      };

      await BaseCrudService.create('jobapplications', newApplication);
      navigate('/applications');
    } catch (error) {
      console.error('Error creating application:', error);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-secondary rounded-full px-8 py-4 shadow-lg">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-heading font-bold text-xl text-secondary-foreground">
            JobTrack
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="font-paragraph text-sm text-secondary-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/applications" className="font-paragraph text-sm text-primary hover:text-brandaccent transition-colors">
              Applications
            </Link>
            <Link to="/resumes" className="font-paragraph text-sm text-secondary-foreground hover:text-primary transition-colors">
              Resumes
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[60rem] mx-auto px-8 md:px-16 py-32">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link to="/applications">
            <Button variant="ghost" className="font-paragraph text-primary-foreground hover:text-primary rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Button>
          </Link>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white border-0 rounded-3xl p-8">
            <CardHeader>
              <CardTitle className="font-heading text-4xl text-primary-foreground">
                Add New Application
              </CardTitle>
              <p className="font-paragraph text-base text-primary-foreground/70 mt-2">
                Track a new job application
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="font-paragraph text-sm text-primary-foreground">
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="bg-background border-0 rounded-2xl font-paragraph"
                      placeholder="e.g., Tech Corp"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="font-paragraph text-sm text-primary-foreground">
                      Job Title *
                    </Label>
                    <Input
                      id="jobTitle"
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="bg-background border-0 rounded-2xl font-paragraph"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="applicationDate" className="font-paragraph text-sm text-primary-foreground">
                      Application Date *
                    </Label>
                    <Input
                      id="applicationDate"
                      type="date"
                      required
                      value={formData.applicationDate}
                      onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                      className="bg-background border-0 rounded-2xl font-paragraph"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applicationStatus" className="font-paragraph text-sm text-primary-foreground">
                      Status *
                    </Label>
                    <Select
                      value={formData.applicationStatus}
                      onValueChange={(value) => setFormData({ ...formData, applicationStatus: value })}
                    >
                      <SelectTrigger className="bg-background border-0 rounded-2xl font-paragraph">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interviewing">Interviewing</SelectItem>
                        <SelectItem value="Offered">Offered</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobLocation" className="font-paragraph text-sm text-primary-foreground">
                    Location
                  </Label>
                  <Input
                    id="jobLocation"
                    type="text"
                    value={formData.jobLocation}
                    onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
                    className="bg-background border-0 rounded-2xl font-paragraph"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobPostingUrl" className="font-paragraph text-sm text-primary-foreground">
                    Job Posting URL
                  </Label>
                  <Input
                    id="jobPostingUrl"
                    type="url"
                    value={formData.jobPostingUrl}
                    onChange={(e) => setFormData({ ...formData, jobPostingUrl: e.target.value })}
                    className="bg-background border-0 rounded-2xl font-paragraph"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyResponse" className="font-paragraph text-sm text-primary-foreground">
                    Company Response / Notes
                  </Label>
                  <Textarea
                    id="companyResponse"
                    value={formData.companyResponse}
                    onChange={(e) => setFormData({ ...formData, companyResponse: e.target.value })}
                    className="bg-background border-0 rounded-2xl font-paragraph min-h-[120px]"
                    placeholder="Add any notes about the application or company response..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph rounded-full py-6"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {saving ? 'Saving...' : 'Save Application'}
                  </Button>
                  <Link to="/applications" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-paragraph rounded-full py-6"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
