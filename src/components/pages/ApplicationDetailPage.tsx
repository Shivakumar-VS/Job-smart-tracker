import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, MapPin, Calendar, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { JobApplications } from '@/entities';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<JobApplications | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadApplication();
    }
  }, [id]);

  const loadApplication = async () => {
    if (!id) return;
    try {
      const app = await BaseCrudService.getById<JobApplications>('jobapplications', id);
      setApplication(app);
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!application) return;
    setUpdating(true);
    try {
      await BaseCrudService.update<JobApplications>('jobapplications', {
        _id: application._id,
        applicationStatus: newStatus,
      });
      setApplication({ ...application, applicationStatus: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!application || !confirm('Are you sure you want to delete this application?')) return;
    try {
      await BaseCrudService.delete('jobapplications', application._id);
      navigate('/applications');
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-paragraph text-lg text-primary-foreground/50">Loading...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-paragraph text-lg text-primary-foreground/50 mb-6">Application not found</p>
          <Link to="/applications">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              Back to Applications
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

      <div className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-32">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white border-0 rounded-3xl p-8">
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="font-heading text-4xl text-primary-foreground mb-4">
                        {application.jobTitle}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-primary-foreground/70">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          <span className="font-paragraph text-base">{application.companyName}</span>
                        </div>
                        {application.jobLocation && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            <span className="font-paragraph text-base">{application.jobLocation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`px-6 py-3 rounded-full font-paragraph text-sm font-medium whitespace-nowrap ${
                      application.applicationStatus === 'Offered' ? 'bg-primary text-primary-foreground' :
                      application.applicationStatus === 'Interviewing' ? 'bg-brandaccent text-primary-foreground' :
                      application.applicationStatus === 'Rejected' ? 'bg-destructive text-destructiveforeground' :
                      'bg-subtlebackground text-primary-foreground'
                    }`}>
                      {application.applicationStatus}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-background rounded-2xl p-6">
                      <p className="font-paragraph text-sm text-primary-foreground/60 mb-2">Application Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <p className="font-heading text-lg text-primary-foreground">
                          {application.applicationDate ? new Date(application.applicationDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not specified'}
                        </p>
                      </div>
                    </div>
                    {application.jobPostingUrl && (
                      <div className="bg-background rounded-2xl p-6">
                        <p className="font-paragraph text-sm text-primary-foreground/60 mb-2">Job Posting</p>
                        <a
                          href={application.jobPostingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span className="font-paragraph text-base">View Original Posting</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {application.companyResponse && (
                    <div className="bg-subtlebackground rounded-2xl p-6">
                      <p className="font-paragraph text-sm text-primary-foreground/60 mb-3">Company Response</p>
                      <p className="font-paragraph text-base text-primary-foreground leading-relaxed">
                        {application.companyResponse}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white border-0 rounded-3xl p-6">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-primary-foreground">
                    Update Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={application.applicationStatus}
                    onValueChange={handleStatusUpdate}
                    disabled={updating}
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
                  {updating && (
                    <p className="font-paragraph text-sm text-primary-foreground/50 text-center">
                      Updating...
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white border-0 rounded-3xl p-6">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-primary-foreground">
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={`/applications/${application._id}/edit`} className="block">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Application
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructiveforeground rounded-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Application
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-brandaccent border-0 rounded-3xl p-6">
                <CardContent className="pt-6">
                  <p className="font-paragraph text-sm text-primary-foreground/70 mb-4">
                    Keep your application status updated to track your progress effectively
                  </p>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground rounded-full">
                      View Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
