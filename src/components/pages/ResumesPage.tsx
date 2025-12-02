import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FileText, Download, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { ResumeVersions } from '@/entities';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeVersions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const { items } = await BaseCrudService.getAll<ResumeVersions>('resumeversions');
      const sorted = items.sort((a, b) => new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime());
      setResumes(sorted);
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (resume: ResumeVersions) => {
    try {
      await BaseCrudService.update<ResumeVersions>('resumeversions', {
        _id: resume._id,
        isActive: !resume.isActive,
      });
      loadResumes();
    } catch (error) {
      console.error('Error updating resume:', error);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume version?')) return;
    try {
      await BaseCrudService.delete('resumeversions', resumeId);
      loadResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
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

      <div className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-4">
                My Resumes
              </h1>
              <p className="font-paragraph text-lg text-primary-foreground/70">
                Manage your resume versions for different job applications
              </p>
            </div>
            <Link to="/resumes/new">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph rounded-full px-8 py-6">
                <Plus className="mr-2 h-5 w-5" />
                Upload Resume
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Resumes Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="font-paragraph text-lg text-primary-foreground/50">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20 bg-white rounded-3xl"
          >
            <FileText className="h-20 w-20 text-primary-foreground/20 mx-auto mb-6" />
            <h2 className="font-heading text-2xl text-primary-foreground mb-4">
              No resumes uploaded yet
            </h2>
            <p className="font-paragraph text-primary-foreground/60 mb-8">
              Upload your first resume version to get started
            </p>
            <Link to="/resumes/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6">
                <Plus className="mr-2 h-5 w-5" />
                Upload Your First Resume
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className={`border-0 rounded-3xl overflow-hidden ${
                  resume.isActive ? 'bg-primary' : 'bg-white'
                }`}>
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      {resume.isActive && (
                        <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="font-paragraph text-xs text-primary-foreground">Active</span>
                        </div>
                      )}
                    </div>

                    <h3 className={`font-heading text-xl mb-2 ${
                      resume.isActive ? 'text-primary-foreground' : 'text-primary-foreground'
                    }`}>
                      {resume.versionName}
                    </h3>

                    {resume.description && (
                      <p className={`font-paragraph text-sm mb-4 line-clamp-2 ${
                        resume.isActive ? 'text-primary-foreground/80' : 'text-primary-foreground/70'
                      }`}>
                        {resume.description}
                      </p>
                    )}

                    <div className={`flex items-center gap-2 mb-6 ${
                      resume.isActive ? 'text-primary-foreground/80' : 'text-primary-foreground/60'
                    }`}>
                      <Calendar className="h-4 w-4" />
                      <span className="font-paragraph text-sm">
                        {resume.uploadDate ? new Date(resume.uploadDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    {resume.fileName && (
                      <p className={`font-paragraph text-xs mb-6 truncate ${
                        resume.isActive ? 'text-primary-foreground/70' : 'text-primary-foreground/50'
                      }`}>
                        {resume.fileName}
                      </p>
                    )}

                    <div className="space-y-3">
                      {resume.resumeFileUrl && (
                        <a
                          href={resume.resumeFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button
                            variant="outline"
                            className={`w-full rounded-full ${
                              resume.isActive 
                                ? 'border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary' 
                                : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                            }`}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </a>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => toggleActive(resume)}
                          className={`flex-1 rounded-full ${
                            resume.isActive 
                              ? 'border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary' 
                              : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                          }`}
                        >
                          {resume.isActive ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Set Active
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDelete(resume._id)}
                          className={`rounded-full ${
                            resume.isActive 
                              ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructiveforeground' 
                              : 'border-destructive text-destructive hover:bg-destructive hover:text-destructiveforeground'
                          }`}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
