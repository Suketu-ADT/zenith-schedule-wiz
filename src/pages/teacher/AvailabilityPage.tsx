import { useState } from 'react';
import { Clock, Save } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';

type AvailabilityState = 'default' | 'preferred' | 'unavailable';

interface TimeSlot {
  time: string;
  [key: string]: string; // For days of week
}

const AvailabilityPage = () => {
  const { toast } = useToast();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Initialize availability state for each time slot and day
  const [availability, setAvailability] = useState<Record<string, Record<string, AvailabilityState>>>(() => {
    const initial: Record<string, Record<string, AvailabilityState>> = {};
    timeSlots.forEach(time => {
      initial[time] = {};
      days.forEach(day => {
        initial[time][day] = 'default';
      });
    });
    return initial;
  });

  const cycleAvailability = (time: string, day: string) => {
    setAvailability(prev => {
      const current = prev[time][day];
      let next: AvailabilityState = 'default';
      
      switch (current) {
        case 'default':
          next = 'preferred';
          break;
        case 'preferred':
          next = 'unavailable';
          break;
        case 'unavailable':
          next = 'default';
          break;
      }

      return {
        ...prev,
        [time]: {
          ...prev[time],
          [day]: next
        }
      };
    });
  };

  const getCellStyles = (state: AvailabilityState) => {
    switch (state) {
      case 'preferred':
        return 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300';
      case 'unavailable':
        return 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300';
      default:
        return 'bg-background hover:bg-muted border-border';
    }
  };

  const getCellLabel = (state: AvailabilityState) => {
    switch (state) {
      case 'preferred':
        return 'Preferred';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Available';
    }
  };

  const handleSavePreferences = () => {
    // Mock save functionality
    console.log('Saving availability preferences:', availability);
    toast({
      title: "Preferences Saved",
      description: "Your availability preferences have been updated successfully.",
    });
  };

  const getStatistics = () => {
    let preferred = 0;
    let unavailable = 0;
    let total = 0;

    timeSlots.forEach(time => {
      days.forEach(day => {
        total++;
        const state = availability[time][day];
        if (state === 'preferred') preferred++;
        if (state === 'unavailable') unavailable++;
      });
    });

    return { preferred, unavailable, available: total - preferred - unavailable, total };
  };

  const stats = getStatistics();

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="My Availability & Preferences"
        subtitle="Set your preferred teaching hours and unavailable time slots"
      />

      {/* Legend and Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
            <CardDescription>Click on time slots to cycle through availability states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border bg-background border-border"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border bg-green-100 dark:bg-green-900/30 border-green-500"></div>
                <span className="text-sm">Preferred</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border bg-red-100 dark:bg-red-900/30 border-red-500"></div>
                <span className="text-sm">Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
            <CardDescription>Your availability breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.preferred}</div>
                <div className="text-sm text-muted-foreground">Preferred</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.unavailable}</div>
                <div className="text-sm text-muted-foreground">Unavailable</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Availability Grid
          </CardTitle>
          <CardDescription>
            Click on each time slot to set your availability preference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="p-3 font-semibold text-center">Time</div>
                {days.map(day => (
                  <div key={day} className="p-3 font-semibold text-center text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-7 gap-2 mb-2">
                  <div className="p-3 font-medium text-center bg-muted rounded-lg">
                    {time}
                  </div>
                  {days.map(day => {
                    const state = availability[time][day];
                    return (
                      <button
                        key={`${time}-${day}`}
                        onClick={() => cycleAvailability(time, day)}
                        className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-all hover:scale-105 ${getCellStyles(state)}`}
                        title={`${day} ${time} - ${getCellLabel(state)}`}
                      >
                        <div className="space-y-1">
                          <div className="text-xs opacity-70">{getCellLabel(state)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={handleSavePreferences} size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityPage;