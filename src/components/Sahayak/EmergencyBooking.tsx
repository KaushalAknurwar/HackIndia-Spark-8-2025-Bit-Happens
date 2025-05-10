import React, { useState } from 'react';
import { sendEmergencyNotification } from '@/services/twilioService';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Phone, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const EmergencyBooking: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		situation: ''
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.id]: e.target.value
		}));
	};

	const handleEmergencyBooking = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		
		try {
			const notificationSent = await sendEmergencyNotification(formData);
			
			if (notificationSent) {
				toast({
					title: "Emergency Request Sent",
					description: "A therapist will contact you within 30 minutes.",
				});
			} else {
				throw new Error("Failed to send notification");
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to send emergency request. Please try again.",
				variant: "destructive"
			});
		} finally {
			setLoading(false);
		}
	};


	const emergencyContacts = [
		{ name: "National Crisis Helpline", number: "1-800-273-8255" },
		{ name: "Suicide Prevention Lifeline", number: "988" },
		{ name: "Crisis Text Line", number: "Text HOME to 741741" }
	];

	return (
		<div className="space-y-6">
			<Alert variant="destructive" className="bg-red-500/10 backdrop-blur-lg border border-red-500/50">
				<AlertTriangle className="h-4 w-4 text-red-500" />
				<AlertTitle className="text-red-500 font-semibold">Emergency Support</AlertTitle>
				<AlertDescription className="text-white">
					If you're experiencing a life-threatening emergency, please call emergency services immediately at <strong className="text-red-500">911</strong>
				</AlertDescription>
			</Alert>

			{emergencyContacts.map(contact => (
				<Card key={contact.number} className="p-6 bg-red-500/10 backdrop-blur-lg border border-red-500/20 hover:bg-red-500/20 transition-all duration-300">
					<div className="flex items-center gap-2 mb-2">
						<Phone className="h-5 w-5 text-red-500" />
						<h3 className="text-lg font-semibold text-white">{contact.name}</h3>
					</div>
					<p className="text-red-400 font-medium">{contact.number}</p>
				</Card>
			))}

			<form onSubmit={handleEmergencyBooking} className="space-y-4">
				<div>
					<Label htmlFor="name" className="text-white">Your Name</Label>
					<Input 
						id="name" 
						value={formData.name}
						onChange={handleChange}
						required 
						className="bg-white/5 backdrop-blur-lg border border-white/10 text-white placeholder:text-white/60"
					/>
				</div>

				<div>
					<Label htmlFor="phone" className="text-white">Phone Number</Label>
					<Input 
						id="phone" 
						type="tel"
						value={formData.phone}
						onChange={handleChange}
						required 
						className="bg-white/5 backdrop-blur-lg border border-white/10 text-white placeholder:text-white/60"
					/>
				</div>

				<div>
					<Label htmlFor="situation" className="text-white">Brief Description of Situation</Label>
					<Textarea 
						id="situation"
						value={formData.situation}
						onChange={handleChange}
						required 
						className="bg-white/5 backdrop-blur-lg border border-white/10 text-white placeholder:text-white/60 min-h-[100px]"
					/>
				</div>

				<Button 
					type="submit" 
					className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90 transition-opacity"
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Processing...
						</>
					) : (
						'Request Emergency Session'
					)}
				</Button>
			</form>

			<div className="mt-4 text-sm text-white/60">
				<p>* A therapist will contact you within 30 minutes</p>
				<p>* Emergency booking fees may apply</p>
				<p>* Your information is kept strictly confidential</p>
			</div>
		</div>
	);

};

export default EmergencyBooking;