
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StrengthsWeaknessChart from '@/components/profile/StrengthsWeaknessChart';
import FadeIn from '@/components/ui/FadeIn';
import { Calendar, Clock, Settings } from 'lucide-react';

const Profile = () => {
  // Sample data for the radar chart
  const strengthsData = [
    { area: 'Creativity', value: 90, fullMark: 100 },
    { area: 'Problem Solving', value: 80, fullMark: 100 },
    { area: 'Pattern Recognition', value: 85, fullMark: 100 },
    { area: 'Focus Duration', value: 40, fullMark: 100 },
    { area: 'Task Switching', value: 45, fullMark: 100 },
    { area: 'Emotional Regulation', value: 60, fullMark: 100 },
    { area: 'Organization', value: 50, fullMark: 100 },
    { area: 'Time Awareness', value: 35, fullMark: 100 },
  ];

  // Sample data for activity over time
  const activityData = [
    { date: 'Mon', focus: 60, energy: 80 },
    { date: 'Tue', focus: 45, energy: 70 },
    { date: 'Wed', focus: 75, energy: 65 },
    { date: 'Thu', focus: 50, energy: 50 },
    { date: 'Fri', focus: 60, energy: 75 },
    { date: 'Sat', focus: 80, energy: 85 },
    { date: 'Sun', focus: 65, energy: 60 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-start mb-12">
              <div>
                <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                  Your Profile
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Overview</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Explore your neurodivergent strengths and patterns based on your assessments.
                </p>
              </div>
              <button className="mt-6 md:mt-0 btn-secondary flex items-center">
                <Settings size={16} className="mr-2" />
                Profile Settings
              </button>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <StrengthsWeaknessChart data={strengthsData} />
              </FadeIn>
            </div>
            
            <div>
              <FadeIn delay={0.2}>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-6">Completion Streak</h3>
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-32 rounded-full border-8 border-accent flex items-center justify-center">
                      <div className="text-center">
                        <span className="block text-4xl font-bold">7</span>
                        <span className="text-sm text-muted-foreground">Days</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div 
                        key={i} 
                        className="aspect-square rounded-md flex items-center justify-center text-xs font-medium bg-accent/10 text-accent"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-muted-foreground text-sm">
                    Great work! You've completed 7 days in a row.
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <div className="glass-card rounded-2xl p-6 mt-8">
                  <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                          <Calendar size={16} className="text-accent" />
                        </div>
                        <span>Assessments Completed</span>
                      </div>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                          <Clock size={16} className="text-accent" />
                        </div>
                        <span>Last Assessment</span>
                      </div>
                      <span className="font-semibold">Today</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                          <Settings size={16} className="text-accent" />
                        </div>
                        <span>Techniques Applied</span>
                      </div>
                      <span className="font-semibold">8</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
          
          <FadeIn delay={0.3}>
            <div className="glass-card rounded-2xl p-6 mt-12">
              <h3 className="text-xl font-semibold mb-6">Weekly Patterns</h3>
              <div className="h-64">
                <div className="grid grid-cols-7 h-full gap-3">
                  {activityData.map((day, index) => (
                    <div key={index} className="flex flex-col h-full justify-end">
                      <div className="relative h-full pt-8 flex flex-col justify-end">
                        <div 
                          className="bg-accent/20 rounded-t-md w-full" 
                          style={{ height: `${day.energy}%` }}
                        ></div>
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-accent rounded-t-md" 
                          style={{ height: `${day.focus}%` }}
                        ></div>
                      </div>
                      <div className="text-center text-xs mt-2 text-muted-foreground">{day.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4 space-x-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent rounded-sm mr-2"></div>
                  <span className="text-sm">Focus Level</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent/20 rounded-sm mr-2"></div>
                  <span className="text-sm">Energy Level</span>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Insights Based on Your Profile</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Your assessment data indicates you have strengths in creativity and pattern recognition, 
                which can be leveraged to help with task organization and time management.
              </p>
              <div className="inline-flex space-x-4">
                <a href="/techniques" className="btn-primary">
                  View Recommended Techniques
                </a>
                <a href="/assessment" className="btn-secondary">
                  Take Today's Assessment
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
