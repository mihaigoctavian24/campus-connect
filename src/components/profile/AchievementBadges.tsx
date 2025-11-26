'use client';

import { Award, Trophy, Star, Zap, Target, Heart } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number; // 0-100 for partially unlocked
}

interface AchievementBadgesProps {
  totalHours: number;
  activeOpportunities: number;
  completedOpportunities: number;
}

export function AchievementBadges({
  totalHours,
  activeOpportunities,
  completedOpportunities,
}: AchievementBadgesProps) {
  // Define achievements based on user stats
  const achievements: Achievement[] = [
    {
      id: 'first_steps',
      name: 'First Steps',
      description: 'Complete your first volunteer activity',
      icon: <Star className="w-6 h-6" />,
      unlocked: completedOpportunities >= 1,
    },
    {
      id: 'getting_started',
      name: 'Getting Started',
      description: 'Log 5 volunteer hours',
      icon: <Zap className="w-6 h-6" />,
      unlocked: totalHours >= 5,
      progress: Math.min((totalHours / 5) * 100, 100),
    },
    {
      id: 'dedicated_volunteer',
      name: 'Dedicated Volunteer',
      description: 'Log 25 volunteer hours',
      icon: <Award className="w-6 h-6" />,
      unlocked: totalHours >= 25,
      progress: Math.min((totalHours / 25) * 100, 100),
    },
    {
      id: 'champion',
      name: 'Community Champion',
      description: 'Log 50 volunteer hours',
      icon: <Trophy className="w-6 h-6" />,
      unlocked: totalHours >= 50,
      progress: Math.min((totalHours / 50) * 100, 100),
    },
    {
      id: 'multitasker',
      name: 'Multitasker',
      description: 'Participate in 3 activities simultaneously',
      icon: <Target className="w-6 h-6" />,
      unlocked: activeOpportunities >= 3,
      progress: Math.min((activeOpportunities / 3) * 100, 100),
    },
    {
      id: 'committed',
      name: 'Committed',
      description: 'Complete 5 volunteer activities',
      icon: <Heart className="w-6 h-6" />,
      unlocked: completedOpportunities >= 5,
      progress: Math.min((completedOpportunities / 5) * 100, 100),
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#001f3f]">Achievements</h3>
        <span className="text-sm text-gray-600">
          {unlockedCount}/{achievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-4 rounded-lg border-2 transition-all ${
              achievement.unlocked
                ? 'border-[gold] bg-yellow-50'
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            {/* Badge Icon */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                achievement.unlocked ? 'bg-[gold] text-white' : 'bg-gray-300 text-gray-500'
              }`}
            >
              {achievement.icon}
            </div>

            {/* Badge Info */}
            <h4
              className={`text-sm font-medium mb-1 ${
                achievement.unlocked ? 'text-[#001f3f]' : 'text-gray-500'
              }`}
            >
              {achievement.name}
            </h4>
            <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>

            {/* Progress Bar (if not fully unlocked) */}
            {!achievement.unlocked && achievement.progress !== undefined && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-[gold] h-1.5 rounded-full transition-all"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {Math.round(achievement.progress)}%
                </p>
              </div>
            )}

            {/* Unlocked Badge */}
            {achievement.unlocked && (
              <div className="absolute top-2 right-2">
                <div className="bg-green-500 text-white rounded-full p-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
