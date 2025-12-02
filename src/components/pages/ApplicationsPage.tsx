import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Building2, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { JobApplications } from '@/entities';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplications[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplications[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const loadApplications = async () => {
    try {
      const { items } = await BaseCrudService.getAll<JobApplications>('jobapplications');
      setApplications(items);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobLocation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.applicationStatus === statusFilter);
    }

    filtered.sort((a, b) => new Date(b.applicationDate || 0).getTime() - new Date(a.applicationDate || 0).getTime());

    setFilteredApplications(filtered);
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

      <div className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-4">
                My Applications
              </h1>
              <p className="font-paragraph text-lg text-primary-foreground/70">
                {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
              </p>
            </div>
            <Link to="/applications/new">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph rounded-full px-8 py-6">
                <Plus className="mr-2 h-5 w-5" />
                Add Application
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-3xl p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/40" />
              <Input
                type="text"
                placeholder="Search by company, role, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-background border-0 rounded-2xl font-paragraph"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/40 pointer-events-none z-10" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="pl-12 bg-background border-0 rounded-2xl font-paragraph">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewing">Interviewing</SelectItem>
                  <SelectItem value="Offered">Offered</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-20">
            <p className="font-paragraph text-lg text-primary-foreground/50">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20 bg-white rounded-3xl"
          >
            <Building2 className="h-20 w-20 text-primary-foreground/20 mx-auto mb-6" />
            <h2 className="font-heading text-2xl text-primary-foreground mb-4">
              {searchQuery || statusFilter !== 'all' ? 'No applications found' : 'No applications yet'}
            </h2>
            <p className="font-paragraph text-primary-foreground/60 mb-8">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start tracking your job applications today'}
            </p>
            <Link to="/applications/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6">
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Application
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredApplications.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link to={`/applications/${app._id}`}>
                  <div className="bg-white rounded-3xl p-8 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="font-heading text-2xl text-primary-foreground mb-2">
                            {app.jobTitle}
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 text-primary-foreground/70">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <span className="font-paragraph text-sm">{app.companyName}</span>
                            </div>
                            {app.jobLocation && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="font-paragraph text-sm">{app.jobLocation}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="font-paragraph text-sm">
                                {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {app.companyResponse && (
                          <p className="font-paragraph text-sm text-primary-foreground/60 line-clamp-2">
                            {app.companyResponse}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-start lg:items-end gap-3">
                        <span className={`px-6 py-3 rounded-full font-paragraph text-sm font-medium ${
                          app.applicationStatus === 'Offered' ? 'bg-primary text-primary-foreground' :
                          app.applicationStatus === 'Interviewing' ? 'bg-brandaccent text-primary-foreground' :
                          app.applicationStatus === 'Rejected' ? 'bg-destructive text-destructiveforeground' :
                          'bg-subtlebackground text-primary-foreground'
                        }`}>
                          {app.applicationStatus}
                        </span>
                        {app.jobPostingUrl && (
                          <a
                            href={app.jobPostingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-paragraph text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            View Posting →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
