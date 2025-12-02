import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { ResumeVersions } from '@/entities';

export default function AddResumePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    versionName: '',
    resumeFileUrl: '',
    description: '',
    fileName: '',
    isActive: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newResume: ResumeVersions = {
        _id: crypto.randomUUID(),
        versionName: formData.versionName,
        resumeFileUrl: formData.resumeFileUrl || undefined,
        uploadDate: new Date().toISOString(),
        description: formData.description || undefined,
        fileName: formData.fileName || undefined,
        isActive: formData.isActive,
      };

      await BaseCrudService.create('resumeversions', newResume);
      navigate('/resumes');
    } catch (error) {
      console.error('Error creating resume:', error);
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
            <Link to="/applications" className="font-paragraph text-sm text-secondary-foreground hover:text-primary transition-colors">
              Applications
            </Link>
            <Link to="/resumes" className="font-paragraph text-sm text-primary hover:text-brandaccent transition-colors">
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
          <Link to="/resumes">
            <Button variant="ghost" className="font-paragraph text-primary-foreground hover:text-primary rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resumes
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
                Upload Resume
              </CardTitle>
              <p className="font-paragraph text-base text-primary-foreground/70 mt-2">
                Add a new resume version to your collection
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="versionName" className="font-paragraph text-sm text-primary-foreground">
                    Version Name *
                  </Label>
                  <Input
                    id="versionName"
                    type="text"
                    required
                    value={formData.versionName}
                    onChange={(e) => setFormData({ ...formData, versionName: e.target.value })}
                    className="bg-background border-0 rounded-2xl font-paragraph"
                    placeholder="e.g., Software Engineer - Tech Focus"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileName" className="font-paragraph text-sm text-primary-foreground">
                    File Name
                  </Label>
                  <Input
                    id="fileName"
                    type="text"
                    value={formData.fileName}
                    onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                    className="bg-background border-0 rounded-2xl font-paragraph"
                    placeholder="e.g., John_Doe_Resume_2025.pdf"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumeFileUrl" className="font-paragraph text-sm text-primary-foreground">
                    Resume File URL
                  </Label>
                  <Input
                    id="resumeFileUrl"
                    type="url"
                    value={formData.resumeFileUrl}
                    onChange={(e) => setFormData({ ...formData, resumeFileUrl: e.target.value })}
                    className="bg-background border-0 rounded-2xl font-paragraph"
                    placeholder="https://..."
                  />
                  <p className="font-paragraph text-xs text-primary-foreground/50">
                    Upload your resume to a cloud storage service and paste the link here
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-paragraph text-sm text-primary-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-background border-0 rounded-2xl font-paragraph min-h-[120px]"
                    placeholder="Describe this resume version, what roles it's tailored for, key highlights, etc."
                  />
                </div>

                <div className="flex items-center gap-3 p-6 bg-subtlebackground rounded-2xl">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isActive" className="font-paragraph text-sm text-primary-foreground cursor-pointer">
                    Set as active resume version
                  </Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph rounded-full py-6"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {saving ? 'Saving...' : 'Save Resume'}
                  </Button>
                  <Link to="/resumes" className="flex-1">
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
