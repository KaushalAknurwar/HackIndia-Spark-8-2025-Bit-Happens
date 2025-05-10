import { ReactNode, useState, useEffect } from 'react';
import { Brain, Trophy, Star, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";


export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  type: 'text' | 'image' | 'scenario';
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'stress' | 'anxiety' | 'mindfulness' | 'general';
  imageUrl?: string;
  explanation?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalScore: number;
  questionsAnswered: number;
  streak: number;
  achievements: string[];
}

const achievements: Achievement[] = [
  {
    id: 'mindfulness_master',
    name: 'Mindfulness Master',
    description: 'Score 100% on mindfulness questions',
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    condition: (stats) => stats.totalScore >= 100
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Achieve a 5 question streak',
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
    condition: (stats) => stats.streak >= 5
  }
];

const allQuestions: Question[] = [
  {
    id: 1,
    text: "Which of these is a common mindfulness technique?",
    options: [
      "Body scanning meditation",
      "Watching TV all day",
      "Skipping meals",
      "Staying up late"
    ],
    correctAnswer: "Body scanning meditation",
    type: 'text',
    difficulty: 'easy',
    category: 'mindfulness',
    explanation: "Body scanning meditation helps you become aware of physical sensations and reduce stress."
  },
  {
    id: 2,
    text: "What's a healthy way to manage stress?",
    options: [
      "Deep breathing exercises",
      "Ignoring the problem",
      "Excessive caffeine intake",
      "Social isolation"
    ],
    correctAnswer: "Deep breathing exercises",
    type: 'text',
    difficulty: 'easy',
    category: 'stress',
    explanation: "Deep breathing helps activate your body's relaxation response."
  },
  {
    id: 3,
    text: "Which activity can help improve mental well-being?",
    options: [
      "Regular exercise",
      "Constant social media use",
      "Irregular sleep patterns",
      "Skipping meals"
    ],
    correctAnswer: "Regular exercise",
    type: 'text',
    difficulty: 'medium',
    category: 'general',
    explanation: "Exercise releases endorphins and improves overall mental health."
  },
  {
    id: 4,
    text: "What is a good practice for emotional awareness?",
    options: [
      "Journaling daily thoughts",
      "Suppressing feelings",
      "Avoiding self-reflection",
      "Ignoring emotions"
    ],
    correctAnswer: "Journaling daily thoughts",
    type: 'text',
    difficulty: 'medium',
    category: 'general',
    explanation: "Journaling helps process emotions and increase self-awareness."
  },
  {
    id: 5,
    text: "Which is an effective relaxation technique?",
    options: [
      "Progressive muscle relaxation",
      "Staying in bed all day",
      "Excessive screen time",
      "Skipping breaks"
    ],
    correctAnswer: "Progressive muscle relaxation",
    type: 'text',
    difficulty: 'medium',
    category: 'stress',
    explanation: "Progressive muscle relaxation helps reduce physical tension and stress."
  },
  {
    id: 6,
    text: "What helps in maintaining good mental health?",
    options: [
      "Regular sleep schedule",
      "Working without breaks",
      "Isolation from others",
      "Irregular eating habits"
    ],
    correctAnswer: "Regular sleep schedule",
    type: 'text',
    difficulty: 'medium',
    category: 'general',
    explanation: "A regular sleep schedule helps maintain mental health and emotional balance."
    },
    {
    id: 7,
    text: "Which practice promotes mindful eating?",
    options: [
      "Eating slowly and mindfully",
      "Eating while working",
      "Skipping breakfast",
      "Fast food daily"
    ],
    correctAnswer: "Eating slowly and mindfully",
    type: 'text',
    difficulty: 'easy',
    category: 'mindfulness',
    explanation: "Mindful eating helps develop a healthier relationship with food."
    },
    {
    id: 8,
    text: "What's a good practice for stress relief?",
    options: [
      "Gentle yoga",
      "Overthinking",
      "Avoiding exercise",
      "Stress eating"
    ],
    correctAnswer: "Gentle yoga",
    type: 'text',
    difficulty: 'easy',
    category: 'stress',
    explanation: "Gentle yoga combines physical movement with mindfulness for stress relief."
    },
    {
    id: 9,
    text: "Which activity supports emotional balance?",
    options: [
      "Nature walks",
      "Excessive gaming",
      "Skipping sleep",
      "Social media addiction"
    ],
    correctAnswer: "Nature walks",
    type: 'text',
    difficulty: 'easy',
    category: 'mindfulness',
    explanation: "Nature walks provide a calming environment and promote mindfulness."
    },
    {
    id: 10,
    text: "What's a healthy coping mechanism?",
    options: [
      "Talking to friends",
      "Emotional eating",
      "Avoiding problems",
      "Retail therapy"
    ],
    correctAnswer: "Talking to friends",
    type: 'text',
    difficulty: 'medium',
    category: 'general',
    explanation: "Social support is crucial for emotional well-being and stress management."
    }
];

const QuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    totalScore: 0,
    questionsAnswered: 0,
    streak: 0,
    achievements: []
  });
  const { toast } = useToast();

  useEffect(() => {
    setRandomizedQuestions([...allQuestions].sort(() => Math.random() - 0.5));
    setIsLoading(false);
  }, []);

  const checkAchievements = () => {
    achievements.forEach(achievement => {
      if (!userStats.achievements.includes(achievement.id) && 
          achievement.condition(userStats)) {
        setUserStats(prev => ({
          ...prev,
          achievements: [...prev.achievements, achievement.id]
        }));
        toast({
          title: "Achievement Unlocked! 🏆",
          description: `${achievement.name}: ${achievement.description}`,
          className: "bg-purple-500 text-white",
        });
      }
    });
  };

  const handleAnswerSelect = async (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer === randomizedQuestions[currentQuestion].correctAnswer;
    const points = isCorrect ? 10 + (userStats.streak * 2) : 0;
    
    setUserStats(prev => ({
      ...prev,
      totalScore: prev.totalScore + points,
      questionsAnswered: prev.questionsAnswered + 1,
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    if (isCorrect) {
      setScore(score + points);
      toast({
        title: "Excellent! 🎉",
        description: `+${points} points${userStats.streak > 0 ? ` (${userStats.streak}x streak bonus!)` : ''}`,
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      });
    } else {
      toast({
        title: "Keep Going! 💪",
        description: randomizedQuestions[currentQuestion].explanation || "Try a different approach next time!",
        className: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
      });
    }

    checkAchievements();

    setTimeout(() => {
      if (currentQuestion < randomizedQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setRandomizedQuestions([...allQuestions].sort(() => Math.random() - 0.5));
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (!randomizedQuestions.length) return null;

  const question = randomizedQuestions[currentQuestion];

  return (
    <div className="p-8 min-h-screen bg-black/40 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5">
      <div className="max-w-4xl mx-auto backdrop-blur-md bg-black/40 rounded-xl p-8 border border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-white mt-4">Loading questions...</p>
          </div>

        ) : showResults ? (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
              Quiz Complete! 🎉
            </h2>
            <div className="grid grid-cols-2 gap-4 my-8">
              <Card className="p-6 bg-black/20 border border-purple-500/20">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-xl text-white mb-2">Final Score</p>
                <p className="text-3xl font-bold text-purple-400">{score}</p>
              </Card>
              <Card className="p-6 bg-black/20 border border-purple-500/20">
                <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-xl text-white mb-2">Best Streak</p>
                <p className="text-3xl font-bold text-purple-400">{userStats.streak}</p>
              </Card>
            </div>
            {userStats.achievements.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Achievements Unlocked</h3>
                <div className="grid grid-cols-2 gap-4">
                  {achievements
                    .filter(a => userStats.achievements.includes(a.id))
                    .map(achievement => (
                      <Card key={achievement.id} className="p-4 bg-black/20 border border-purple-500/20">
                        <div className="flex items-center gap-3">
                          {achievement.icon}
                          <div>
                            <p className="font-semibold text-white">{achievement.name}</p>
                            <p className="text-sm text-white/60">{achievement.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            )}


            <Button 
              onClick={resetQuiz}
              className="mt-8 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white border-0 px-8 py-2 rounded-xl"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-[#D946EF]" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
                  Mental Health Quiz
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  Streak: {userStats.streak}🔥
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  Score: {score}
                </Badge>
              </div>
            </div>
            
            <Card className="p-6 bg-black/20 border border-purple-500/20">
              <div className="flex justify-between items-center mb-6">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  Question {currentQuestion + 1}/{randomizedQuestions.length}
                </Badge>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    {question.difficulty.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    {question.category.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-6">{question.text}</h2>
              
              {question.imageUrl && (
                <img 
                  src={question.imageUrl} 
                  alt="Question visual"
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
              )}
              
              <div className="grid gap-4">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      isAnswered
                        ? option === question.correctAnswer
                          ? "default"
                          : option === selectedAnswer
                          ? "destructive"
                          : "secondary"
                        : "secondary"
                    }
                    className={`w-full p-4 text-left justify-between bg-black/20 border border-purple-500/20 hover:bg-black/30 ${
                      isAnswered ? 'cursor-not-allowed' : 'hover:scale-105'
                    } transition-all duration-300`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                  >
                    <span className="text-white">{option}</span>
                    {isAnswered && option === question.correctAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    )}
                    {isAnswered && option === selectedAnswer && option !== question.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </Button>
                ))}
                </div>
              </Card>
              </>
            )}
            </div>
          </div>
          );
        };

        export default QuizSection;