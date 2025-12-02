import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FileText, TrendingUp, Plus, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { JobApplications } from '@/entities';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const [applications, setApplications] = useState<JobApplications[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

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

  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.applicationStatus === 'Applied').length,
    interviewing: applications.filter(app => app.applicationStatus === 'Interviewing').length,
    rejected: applications.filter(app => app.applicationStatus === 'Rejected').length,
    offered: applications.filter(app => app.applicationStatus === 'Offered').length,
  };

  const statusData = [
    { name: 'Applied', value: stats.applied, color: '#BEEB00' },
    { name: 'Interviewing', value: stats.interviewing, color: '#E6F47A' },
    { name: 'Rejected', value: stats.rejected, color: '#DF3131' },
    { name: 'Offered', value: stats.offered, color: '#DFF7B9' },
  ].filter(item => item.value > 0);

  const recentApplications = applications
    .sort((a, b) => new Date(b.applicationDate || 0).getTime() - new Date(a.applicationDate || 0).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-secondary rounded-full px-8 py-4 shadow-lg">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-heading font-bold text-xl text-secondary-foreground">
            JobTrack
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="font-paragraph text-sm text-primary hover:text-brandaccent transition-colors">
              Dashboard
            </Link>
            <Link to="/applications" className="font-paragraph text-sm text-secondary-foreground hover:text-primary transition-colors">
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-4">
                Your Dashboard
              </h1>
              <p className="font-paragraph text-lg text-primary-foreground/70">
                Track your job search progress at a glance
              </p>
            </div>
            <Link to="/applications/new">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph rounded-full px-8 py-6">
                <Plus className="mr-2 h-5 w-5" />
                Add Application
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-subtlebackground border-0 rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base text-primary-foreground/70 flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Total Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl text-primary-foreground">{stats.total}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-brandaccent border-0 rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base text-primary-foreground/70 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Applied
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl text-primary-foreground">{stats.applied}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-subtlebackground border-0 rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base text-primary-foreground/70 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Interviewing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl text-primary-foreground">{stats.interviewing}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-primary border-0 rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base text-primary-foreground/70 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl text-primary-foreground">{stats.offered}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-white border-0 rounded-3xl p-8">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-primary-foreground">
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="font-paragraph text-primary-foreground/50">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-white border-0 rounded-3xl p-8">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-primary-foreground">
                  Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E9F6D9" />
                      <XAxis dataKey="name" stroke="#0D1A1A" />
                      <YAxis stroke="#0D1A1A" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#BEEB00" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="font-paragraph text-primary-foreground/50">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="bg-white border-0 rounded-3xl p-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-2xl text-primary-foreground">
                Recent Applications
              </CardTitle>
              <Link to="/applications">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="font-paragraph text-primary-foreground/50 text-center py-8">Loading...</p>
              ) : recentApplications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-primary-foreground/20 mx-auto mb-4" />
                  <p className="font-paragraph text-primary-foreground/50 mb-4">No applications yet</p>
                  <Link to="/applications/new">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                      Add Your First Application
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <Link key={app._id} to={`/applications/${app._id}`}>
                      <div className="p-6 bg-background rounded-2xl hover:bg-subtlebackground transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-heading text-lg text-primary-foreground mb-1">
                              {app.jobTitle}
                            </h3>
                            <p className="font-paragraph text-sm text-primary-foreground/70">
                              {app.companyName} • {app.jobLocation}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-full font-paragraph text-sm ${
                              app.applicationStatus === 'Offered' ? 'bg-primary text-primary-foreground' :
                              app.applicationStatus === 'Interviewing' ? 'bg-brandaccent text-primary-foreground' :
                              app.applicationStatus === 'Rejected' ? 'bg-destructive text-destructiveforeground' :
                              'bg-subtlebackground text-primary-foreground'
                            }`}>
                              {app.applicationStatus}
                            </span>
                            <span className="font-paragraph text-sm text-primary-foreground/50">
                              {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
