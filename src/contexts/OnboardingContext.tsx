import React, { createContext, useContext, useState } from 'react';

interface OnboardingResponse {
	mood: string;
	goals: string[];
	supportNeeded: string;
	sleepQuality: string;
	stressLevel: number;
}

interface OnboardingContextType {
	responses: OnboardingResponse;
	setResponses: React.Dispatch<React.SetStateAction<OnboardingResponse>>;
	isOnboardingComplete: boolean;
	setOnboardingComplete: (value: boolean) => void;
	currentStep: number;
	setCurrentStep: (step: number) => void;
}

const defaultResponses: OnboardingResponse = {
	mood: '',
	goals: [],
	supportNeeded: '',
	sleepQuality: '',
	stressLevel: 0,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
	const [responses, setResponses] = useState<OnboardingResponse>(defaultResponses);
	const [isOnboardingComplete, setOnboardingComplete] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);

	return (
		<OnboardingContext.Provider
			value={{
				responses,
				setResponses,
				isOnboardingComplete,
				setOnboardingComplete,
				currentStep,
				setCurrentStep,
			}}
		>
			{children}
		</OnboardingContext.Provider>
	);
}

export function useOnboarding() {
	const context = useContext(OnboardingContext);
	if (context === undefined) {
		throw new Error('useOnboarding must be used within an OnboardingProvider');
	}
	return context;
}