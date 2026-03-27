import { Heart, Activity, Droplet, TrendingUp, Award, Target, Flame, Trophy } from "lucide-react";
import { Card } from "../components/common/Card";
import { Progress } from "../components/common/Progress";
import { Badge } from "../components/common/Badge";

const healthStats = [
  {
    label: "Heart Health",
    score: 85,
    status: "Good",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
    trend: "+5%"
  },
  {
    label: "Blood Sugar",
    score: 72,
    status: "Monitor",
    icon: Droplet,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    trend: "-2%"
  },
  {
    label: "Physical Activity",
    score: 90,
    status: "Excellent",
    icon: Activity,
    color: "text-green-500",
    bgColor: "bg-green-50",
    trend: "+12%"
  },
  {
    label: "Overall Wellness",
    score: 82,
    status: "Good",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    trend: "+8%"
  }
];

const riskFactors = [
  { factor: "Cardiovascular Disease", level: "Low", color: "green", score: 15 },
  { factor: "Type 2 Diabetes", level: "Medium", color: "yellow", score: 45 },
  { factor: "Hypertension", level: "Low", color: "green", score: 20 },
  { factor: "Obesity", level: "Low", color: "green", score: 25 }
];

const dailyTips = [
  {
    category: "Nutrition",
    tip: "Increase your fiber intake by adding more vegetables to your meals",
    icon: "🥗"
  },
  {
    category: "Exercise",
    tip: "Aim for 30 minutes of moderate exercise today - a brisk walk counts!",
    icon: "🏃"
  },
  {
    category: "Hydration",
    tip: "Drink at least 8 glasses of water throughout the day",
    icon: "💧"
  },
  {
    category: "Sleep",
    tip: "Maintain a consistent sleep schedule for better health outcomes",
    icon: "😴"
  }
];

const achievements = [
  { name: "7-Day Streak", progress: 100, icon: Flame, color: "orange" },
  { name: "Monthly Goal", progress: 75, icon: Target, color: "blue" },
  { name: "Health Champion", progress: 60, icon: Trophy, color: "yellow" },
  { name: "Wellness Warrior", progress: 45, icon: Award, color: "purple" }
];

export function PreventiveHealthDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Preventive Health Dashboard</h1>
        <p className="text-gray-600 mt-1">AI-powered insights to keep you healthy and prevent diseases</p>
      </div>

      {/* Health Score Overview */}
      <Card className="p-8 border-0 shadow-sm bg-gradient-to-r from-cyan-600 to-teal-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cyan-50 mb-2">Your Health Score</p>
            <h2 className="text-5xl font-bold mb-2">82/100</h2>
            <p className="text-cyan-50">Great job! Keep up the healthy habits.</p>
          </div>
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-14 h-14 text-cyan-600" />
            </div>
          </div>
        </div>
      </Card>

      {/* Health Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 border-0 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge className={`${stat.bgColor} ${stat.color} hover:${stat.bgColor}`}>
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <div className="flex items-end gap-2 mb-3">
                <p className="text-3xl font-bold text-gray-900">{stat.score}</p>
                <p className="text-sm text-gray-600 mb-1">/100</p>
              </div>
              <Progress value={stat.score} className="h-2 mb-2" />
              <p className={`text-xs font-medium ${stat.color}`}>{stat.status}</p>
            </Card>
          );
        })}
      </div>

      {/* Risk Assessment & Daily Tips */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk Level Indicators */}
        <Card className="p-6 border-0 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Risk Assessment</h3>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{risk.factor}</p>
                  <Badge 
                    className={`
                      ${risk.color === 'green' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                      ${risk.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' : ''}
                      ${risk.color === 'red' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                    `}
                  >
                    {risk.level} Risk
                  </Badge>
                </div>
                <Progress 
                  value={risk.score} 
                  className={`h-2 ${
                    risk.color === 'green' ? '[&>div]:bg-green-500' : 
                    risk.color === 'yellow' ? '[&>div]:bg-yellow-500' : 
                    '[&>div]:bg-red-500'
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-gray-100">
            Risk scores are calculated based on your health data, lifestyle factors, and family history.
          </p>
        </Card>

        {/* Daily Health Tips */}
        <Card className="p-6 border-0 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Today's Health Tips</h3>
          <div className="space-y-4">
            {dailyTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl">
                <div className="text-2xl">{tip.icon}</div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-cyan-700 mb-1">{tip.category}</p>
                  <p className="text-sm text-gray-900">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Gamification Progress */}
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Your Achievements</h3>
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            Level 12
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 bg-${achievement.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-10 h-10 text-${achievement.color}-600`} />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-2">{achievement.name}</p>
                <Progress value={achievement.progress} className="h-2 mb-1" />
                <p className="text-xs text-gray-600">{achievement.progress}% Complete</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Weekly Health Summary */}
      <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
        <h3 className="font-semibold text-gray-900 mb-4">Weekly Summary</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">5,450</p>
            <p className="text-sm text-gray-600">Steps/day avg</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">7.5h</p>
            <p className="text-sm text-gray-600">Sleep avg</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 mb-1">85%</p>
            <p className="text-sm text-gray-600">Goals achieved</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600 mb-1">1,850</p>
            <p className="text-sm text-gray-600">Calories/day avg</p>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6 border-0 shadow-sm border-l-4 border-l-cyan-600 bg-cyan-50">
        <h3 className="font-semibold text-gray-900 mb-3">Recommended Next Steps</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-600 rounded-full" />
            <p className="text-sm text-gray-900">Schedule your annual health checkup</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-600 rounded-full" />
            <p className="text-sm text-gray-900">Complete your blood glucose monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-600 rounded-full" />
            <p className="text-sm text-gray-900">Book a consultation with a nutritionist</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

