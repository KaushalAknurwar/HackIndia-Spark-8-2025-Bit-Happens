import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
	{
		id: 'mood',
		title: 'How are you feeling today?',
		options: ['Great', 'Good', 'Okay', 'Not so good', 'Struggling'],
	},
	{
		id: 'goals',
		title: 'What are your main goals? (Select all that apply)',
		options: ['Reduce stress', 'Improve sleep', 'Manage anxiety', 'Build resilience', 'Find support'],
		multiple: true,
	},
	{
		id: 'supportNeeded',
		title: 'What kind of support are you looking for?',
		options: ['Professional help', 'Self-help tools', 'Community support', 'Crisis resources'],
	},
	{
		id: 'stressLevel',
		title: 'On a scale of 1-10, how would you rate your current stress level?',
		type: 'slider',
		min: 1,
		max: 10,
	},
];

export function OnboardingQuestionnaire() {
	const navigate = useNavigate();
	const { responses, setResponses, currentStep, setCurrentStep, setOnboardingComplete } = useOnboarding();

	const progress = ((currentStep + 1) / questions.length) * 100;

	const handleNext = () => {
		if (currentStep < questions.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			setOnboardingComplete(true);
			navigate('/dashboard');
		}
	};

	const handleSkip = () => {
		handleNext();
	};

	const handleOptionSelect = (questionId: string, value: any) => {
		setResponses((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const renderQuestion = (question: any) => {
		return (
			<motion.div
				key={question.id}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -20 }}
				className="space-y-4"
			>
				<h2 className="text-2xl font-semibold text-foreground">{question.title}</h2>
				<div className="space-y-3">
					{question.type === 'slider' ? (
						<div className="space-y-4">
							<Slider
								value={[responses[question.id] || question.min]}
								min={question.min}
								max={question.max}
								step={1}
								onValueChange={(value) => handleOptionSelect(question.id, value[0])}
								className="w-full"
							/>
							<div className="text-center text-2xl font-bold">
								{responses[question.id] || question.min}
							</div>
						</div>
					) : (
						question.options?.map((option: string) => (
							<Button
								key={option}
								variant={responses[question.id]?.includes(option) ? "default" : "outline"}
								className="w-full justify-start text-left"
								onClick={() => handleOptionSelect(question.id, 
									question.multiple 
										? responses[question.id]?.includes(option)
											? responses[question.id].filter((o: string) => o !== option)
											: [...(responses[question.id] || []), option]
										: option
								)}
							>
								{option}
							</Button>
						))
					)}
				</div>
			</motion.div>
		);
	};

	return (
		<div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-lg"
			>
				<Card className="onboarding-card p-8 space-y-8">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="space-y-2"
					>
						<h1 className="gradient-text text-3xl font-bold text-center">Welcome to Zenith</h1>
						<p className="text-white/60 text-center">Let's personalize your experience</p>
					</motion.div>
					
					<div className="onboarding-slider">
						<div 
							className="onboarding-progress" 
							style={{ width: `${progress}%` }}
						/>
					</div>
					
					<AnimatePresence mode="wait">
						<motion.div
							key={questions[currentStep].id}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3 }}
							className="space-y-6 onboarding-enter"
					>
						<h2 className="text-2xl font-semibold text-white">{questions[currentStep].title}</h2>
						<div className="space-y-3">
							{questions[currentStep].type === 'slider' ? (
								<div className="space-y-6">
									<div className="onboarding-slider">
										<Slider
											value={[responses[questions[currentStep].id] || questions[currentStep].min]}
											min={questions[currentStep].min}
											max={questions[currentStep].max}
											step={1}
											onValueChange={(value) => handleOptionSelect(questions[currentStep].id, value[0])}
											className="w-full"
										/>
									</div>
									<div className="text-center">
										<span className="text-3xl font-bold gradient-text">
											{responses[questions[currentStep].id] || questions[currentStep].min}
										</span>
									</div>
								</div>
							) : (
								questions[currentStep].options?.map((option: string) => (
									<Button
										key={option}
										variant={responses[questions[currentStep].id]?.includes(option) ? "default" : "outline"}
										className={`w-full justify-start text-left hover-card ${
											responses[questions[currentStep].id]?.includes(option) 
												? 'button-gradient' 
												: 'glass-morphism'
										}`}
										onClick={() => handleOptionSelect(questions[currentStep].id, 
											questions[currentStep].multiple 
												? responses[questions[currentStep].id]?.includes(option)
													? responses[questions[currentStep].id].filter((o: string) => o !== option)
													: [...(responses[questions[currentStep].id] || []), option]
												: option
										)}
									>
										{option}
									</Button>
								))
							)}
						</div>
					</motion.div>
				</AnimatePresence>

				<motion.div 
					className="flex justify-between pt-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					<Button 
						variant="ghost" 
						onClick={handleSkip}
						className="text-white/60 hover:text-white transition-colors duration-200"
					>
						Skip
					</Button>
					<Button 
						onClick={handleNext}
						className="button-gradient animate-float"
					>
						{currentStep === questions.length - 1 ? 'Complete' : 'Next'}
					</Button>
				</motion.div>
			</Card>
		</motion.div>
	</div>
	);
}