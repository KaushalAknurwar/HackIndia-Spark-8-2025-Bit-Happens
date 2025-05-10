import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Therapist } from './Sahayak';

const MOCK_THERAPISTS: Therapist[] = [
	{
		id: "1",
		name: "Dr. Anubha Jain",
		specialization: ["Anxiety", "Depression", "CBT"],
		availability: ["Mon", "Wed", "Fri"],
		rating: 4.8,
		experience: 8,
		price: 100,
		image: "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
	},
	{
		id: "2",
		name: "Dr. Siddharth Singh",
		specialization: ["Trauma", "PTSD", "DBT"],
		availability: ["Tue", "Thu", "Sat"],
		rating: 4.9,
		experience: 12,
		price: 120,
		image: "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
	}
];

const TherapistListing: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
	const [therapists, setTherapists] = useState<Therapist[]>(MOCK_THERAPISTS);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [showPaymentAlert, setShowPaymentAlert] = useState(false);

	const handleBooking = () => {
		setShowPaymentAlert(true);
		// Placeholder for payment gateway integration
		setTimeout(() => {
			alert('Payment successful! Session booked.');
			setShowPaymentAlert(false);
		}, 1500);
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		filterTherapists(event.target.value, selectedSpecialization);
	};

	const filterTherapists = (search: string, specialization: string) => {
		let filtered = MOCK_THERAPISTS;
		if (search) {
			filtered = filtered.filter(t => 
				t.name.toLowerCase().includes(search.toLowerCase()) ||
				t.specialization.some(s => s.toLowerCase().includes(search.toLowerCase()))
			);
		}
		if (specialization) {
			filtered = filtered.filter(t => 
				t.specialization.includes(specialization)
			);
		}
		setTherapists(filtered);
	};

	return (
		<div className="space-y-6">
			<div className="flex gap-4 mb-6">
				<Input
					placeholder="Search therapists..."
					value={searchTerm}
					onChange={handleSearch}
					className="max-w-sm bg-white/5 backdrop-blur-lg border border-white/10 text-white placeholder:text-white/60"
				/>
				<select
					className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-md p-2 text-white outline-none"
					value={selectedSpecialization}
					onChange={(e) => {
						setSelectedSpecialization(e.target.value);
						filterTherapists(searchTerm, e.target.value);
					}}
				>
					<option value="" className="bg-[#1A1F3C] text-white">All Specializations</option>
					<option value="Anxiety" className="bg-[#1A1F3C] text-white">Anxiety</option>
					<option value="Depression" className="bg-[#1A1F3C] text-white">Depression</option>
					<option value="Trauma" className="bg-[#1A1F3C] text-white">Trauma</option>
					<option value="CBT" className="bg-[#1A1F3C] text-white">CBT</option>
					<option value="DBT" className="bg-[#1A1F3C] text-white">DBT</option>
				</select>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{therapists.map((therapist) => (
					<Card key={therapist.id} className="bg-white/5 backdrop-blur-lg border border-white/10 p-4">
						<div className="flex items-start gap-4">
							<img
								src={therapist.image}
								alt={therapist.name}
								className="w-20 h-20 rounded-full border-2 border-[#8B5CF6]/30"
							/>
							<div>
								<h3 className="font-semibold text-white">{therapist.name}</h3>
								<div className="flex flex-wrap gap-1 mt-2">
									{therapist.specialization.map((spec) => (
										<Badge key={spec} variant="secondary" className="bg-[#8B5CF6]/20 text-white border border-[#8B5CF6]/30">
											{spec}
										</Badge>
									))}
								</div>
								<p className="text-sm mt-2 text-white/80">
									Experience: {therapist.experience} years
								</p>
								<p className="text-sm text-white/80">
									Price: Rs. 350/hour
								</p>
								<Dialog>
									<DialogTrigger asChild>
										<Button className="mt-4 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 text-white">
											Book Session
										</Button>
									</DialogTrigger>
									<DialogContent className="bg-[#1A1F3C] border border-white/10 text-white">
										<DialogHeader>
											<DialogTitle className="text-white">Book Session with {therapist.name}</DialogTitle>
										</DialogHeader>
										<div className="space-y-4">
											<div className="flex gap-4 mb-4">
												<Button variant="outline" className="w-1/2 bg-white/5 border-white/10 text-white hover:bg-white/20">
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M23 7 16 12 23 17z"/><rect width="15" height="14" x="1" y="5" rx="2"/></svg>
													Video Call
												</Button>
												<Button variant="outline" className="w-1/2 bg-white/5 border-white/10 text-white hover:bg-white/20">
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/></svg>
													Chat Session
												</Button>
											</div>
											<Calendar
												mode="single"
												selected={selectedDate}
												onSelect={setSelectedDate}
												className="rounded-md border border-white/10 bg-white/5 text-white"
												classNames={{
													day_selected: "bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90",
													day: "text-white hover:bg-white/10",
													day_today: "bg-white/5 text-white",
													day_outside: "text-white/40",
													day_disabled: "text-white/20",
													day_range_middle: "bg-white/5",
													day_hidden: "invisible",
													nav_button: "text-white hover:bg-white/10",
													caption: "text-white"
												}}
											/>
											<div className="grid grid-cols-3 gap-2">
												{["9:00 AM", "10:00 AM", "11:00 AM"].map((time) => (
													<Button
														key={time}
														variant="outline"
														className="w-full bg-white/5 border-white/10 text-white hover:bg-white/20"
													>
														{time}
													</Button>
												))}
											</div>
											{showPaymentAlert && (
												<Alert className="bg-white/5 border border-white/10">
													<AlertCircle className="h-4 w-4 text-white" />
													<AlertDescription className="text-white">
														Processing payment... Please wait.
													</AlertDescription>
												</Alert>
											)}
											<Button 
												className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90" 
												onClick={handleBooking}
											>
												Book Session (${therapist.price})
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default TherapistListing;