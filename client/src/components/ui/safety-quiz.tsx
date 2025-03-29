import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./card";
import { Progress } from "./progress";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion, quizQuestions } from "@/lib/data/quizQuestions";
import { safetyTips } from "@/lib/data/safetyTips";
import { TipIcon, FireIcon } from "@/assets/icons";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import { useAudio } from "@/lib/stores/useAudio";
import Confetti from "react-confetti";

interface SafetyQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
  questionCount?: number; // Number of questions to include in the quiz
}

const SafetyQuiz: React.FC<SafetyQuizProps> = ({
  onComplete,
  questionCount = 5
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { tipsCollected } = useFireSafetyGame();
  const { playSuccess, playHit } = useAudio.getState();
  
  // Select random questions, preferring those related to collected tips
  useEffect(() => {
    // Separate questions related to collected tips
    const relatedQuestions = quizQuestions.filter(
      q => q.relatedTipId && tipsCollected.includes(q.relatedTipId)
    );
    
    // Other questions (not related to collected tips)
    const otherQuestions = quizQuestions.filter(
      q => !q.relatedTipId || !tipsCollected.includes(q.relatedTipId)
    );
    
    // Shuffle both arrays
    const shuffledRelated = [...relatedQuestions].sort(() => Math.random() - 0.5);
    const shuffledOther = [...otherQuestions].sort(() => Math.random() - 0.5);
    
    // Take as many related questions as possible, then fill with other questions
    const relatedToUse = shuffledRelated.slice(0, Math.min(questionCount, shuffledRelated.length));
    const otherToUse = shuffledOther.slice(0, questionCount - relatedToUse.length);
    
    // Combine and shuffle the final set
    const combinedQuestions = [...relatedToUse, ...otherToUse].sort(() => Math.random() - 0.5);
    
    setQuestions(combinedQuestions);
  }, [tipsCollected, questionCount]);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(index);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null) return;
    
    setIsAnswerSubmitted(true);
    
    if (selectedOptionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
      playSuccess();
    } else {
      playHit();
    }
  };
  
  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      setShowConfetti(true);
      
      if (onComplete) {
        onComplete(score + (selectedOptionIndex === currentQuestion.correctAnswer ? 1 : 0), questions.length);
      }
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };
  
  const handleRestartQuiz = () => {
    // Shuffle questions again
    setQuestions([...questions].sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };
  
  // Loading state
  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-3 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Quiz completed view
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;
    
    return (
      <>
        {showConfetti && isPerfect && <Confetti recycle={false} numberOfPieces={200} />}
        
        <Card className="w-full max-w-3xl mx-auto border-amber-300">
          <CardHeader className="bg-amber-100 dark:bg-amber-900/50 py-3 sm:py-6">
            <CardTitle className="text-center flex items-center justify-center gap-2 text-base sm:text-lg">
              <FireIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              <span>Quiz Results</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {isPerfect ? "Perfect Score!" : "Quiz Completed!"}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  You scored {score} out of {questions.length} questions correctly.
                </p>
                
                <div className="flex justify-center mb-4 sm:mb-6">
                  <Badge 
                    variant={isPerfect ? "default" : percentage >= 70 ? "outline" : "secondary"}
                    className={cn(
                      "text-base sm:text-lg py-1 sm:py-2 px-3 sm:px-4 text-white",
                      isPerfect ? "bg-amber-500" : 
                      percentage >= 70 ? "bg-green-500" : 
                      "bg-blue-500"
                    )}
                  >
                    {isPerfect ? "Fire Safety Expert!" : 
                     percentage >= 80 ? "Great Knowledge!" :
                     percentage >= 70 ? "Good Understanding" :
                     percentage >= 50 ? "Needs Practice" :
                     "Keep Learning"}
                  </Badge>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <Progress value={percentage} className="h-2 sm:h-3" />
                  <p className="text-xs sm:text-sm text-center mt-1 sm:mt-2">{percentage}% Correct</p>
                </div>
              </div>
              
              {percentage < 70 && (
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 sm:p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <TipIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-300 text-sm sm:text-base">Tip for Improvement</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Visit the Safety Guide to review the fire safety tips you've collected, and keep playing to collect more tips!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 p-3 sm:p-6 pt-2 sm:pt-2">
            <Button 
              onClick={handleRestartQuiz} 
              variant="outline"
              className="w-full sm:w-auto min-h-10"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/safety-guide'}
              className="w-full sm:w-auto min-h-10"
            >
              Review Safety Tips
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  }
  
  // Active quiz view
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <Badge variant="outline" className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm">
          Question {currentQuestionIndex + 1} of {questions.length}
        </Badge>
        <Badge variant="outline" className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm">
          Score: {score}/{currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}
        </Badge>
      </div>
      
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <Progress 
            value={(currentQuestionIndex / questions.length) * 100} 
            className="h-1.5 sm:h-2 mb-3 sm:mb-4" 
          />
          <CardTitle className="text-base sm:text-xl">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-2">
          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: !isAnswerSubmitted ? 1.01 : 1 }}
                whileTap={{ scale: !isAnswerSubmitted ? 0.98 : 1 }}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left py-2 sm:py-4 px-3 sm:px-4 h-auto text-sm sm:text-base",
                    selectedOptionIndex === index && !isAnswerSubmitted 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "",
                    isAnswerSubmitted && index === currentQuestion.correctAnswer
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : "",
                    isAnswerSubmitted && index === selectedOptionIndex && index !== currentQuestion.correctAnswer
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                      : ""
                  )}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswerSubmitted}
                >
                  <div className="flex items-center">
                    <div 
                      className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 border text-xs sm:text-sm",
                        selectedOptionIndex === index && !isAnswerSubmitted 
                          ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                          : "border-gray-300 dark:border-gray-600",
                        isAnswerSubmitted && index === currentQuestion.correctAnswer
                          ? "border-green-500 bg-green-100 dark:bg-green-900"
                          : "",
                        isAnswerSubmitted && index === selectedOptionIndex && index !== currentQuestion.correctAnswer
                          ? "border-red-500 bg-red-100 dark:bg-red-900"
                          : ""
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
          
          {isAnswerSubmitted && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border"
              >
                <h4 className="font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  {selectedOptionIndex === currentQuestion.correctAnswer ? (
                    <>
                      <span className="text-green-500">✓</span>
                      <span>Correct!</span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-500">✗</span>
                      <span>Incorrect</span>
                    </>
                  )}
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {currentQuestion.explanation}
                </p>
                
                {currentQuestion.relatedTipId && (
                  <div className="mt-3 sm:mt-4 text-xs sm:text-sm">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      Related to Safety Tip #{currentQuestion.relatedTipId}:
                    </span>{" "}
                    {safetyTips.find(t => t.id === currentQuestion.relatedTipId)?.title}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end p-3 sm:p-6 pt-2 sm:pt-2">
          {!isAnswerSubmitted ? (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={selectedOptionIndex === null}
              className="min-h-9 sm:min-h-10 text-sm sm:text-base"
              size="sm"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion}
              className="min-h-9 sm:min-h-10 text-sm sm:text-base"
              size="sm"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SafetyQuiz;