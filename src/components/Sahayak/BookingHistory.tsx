import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

interface NotificationPreferences {
	email: boolean;
	push: boolean;
}

interface BookingSession {
	id: string;
	therapistName: string;
	date: string;
	time: string;
	status: 'upcoming' | 'completed' | 'cancelled';
	type: 'video' | 'chat';
}

const MOCK_SESSIONS: BookingSession[] = [
	{
		id: '1',
		therapistName: 'Dr. Anubha Jain',
		date: '2024-02-20',
		time: '10:00 AM',
		status: 'upcoming',
		type: 'video'
	},
	{
		id: '2',
		therapistName: 'Dr. Siddharth Singh',
		date: '2024-02-15',
		time: '2:00 PM',
		status: 'completed',
		type: 'chat'
	}
];

const BookingHistory: React.FC = () => {
	const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
		email: true,
		push: true
	});

	const handleNotificationToggle = (type: keyof NotificationPreferences) => {
		setNotificationPrefs(prev => {
			const newPrefs = { ...prev, [type]: !prev[type] };
			// Placeholder for API call to update notification preferences
			console.log('Updating notification preferences:', newPrefs);
			return newPrefs;
		});
	};

	const NotificationSettings = () => (
		<Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 mb-4 text-white">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Bell className="h-5 w-5 text-[#8B5CF6]" />
					<h3 className="font-semibold">Notification Settings</h3>
				</div>
			</div>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<label htmlFor="email-notifications" className="text-white/80">Email Notifications</label>
					<Switch
						id="email-notifications"
						checked={notificationPrefs.email}
						onCheckedChange={() => handleNotificationToggle('email')}
						className="data-[state=checked]:bg-[#8B5CF6]"
					/>
				</div>
				<div className="flex items-center justify-between">
					<label htmlFor="push-notifications" className="text-white/80">Push Notifications</label>
					<Switch
						id="push-notifications"
						checked={notificationPrefs.push}
						onCheckedChange={() => handleNotificationToggle('push')}
						className="data-[state=checked]:bg-[#8B5CF6]"
					/>
				</div>
			</div>
		</Card>
	);

	const upcomingSessions = MOCK_SESSIONS.filter(session => session.status === 'upcoming');
	const pastSessions = MOCK_SESSIONS.filter(session => session.status === 'completed');

	const SessionCard: React.FC<{ session: BookingSession }> = ({ session }) => (
		<Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 mb-4 text-white hover:bg-white/10 transition-all duration-300">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="font-semibold text-white">{session.therapistName}</h3>
					<p className="text-sm text-white/60">
						{session.date} at {session.time}
					</p>
					<div className="mt-2">
						<Badge 
							variant={session.status === 'upcoming' ? 'default' : 'secondary'}
							className={session.status === 'upcoming' ? 'bg-[#8B5CF6]/20 text-white border border-[#8B5CF6]/30' : 'bg-white/10 text-white/60'}
						>
							{session.status}
						</Badge>
						<Badge variant="outline" className="ml-2 border-white/10 text-white/80">
							{session.type}
						</Badge>
					</div>
				</div>
				{session.status === 'upcoming' && (
					<Button className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 text-white">
						Join Session
					</Button>
				)}
			</div>
		</Card>
	);

	return (
		<div>
			<NotificationSettings />
			<Tabs defaultValue="upcoming" className="w-full">
				<TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-lg border border-white/10">
					<TabsTrigger 
						value="upcoming" 
						className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
					>
						Upcoming Sessions
					</TabsTrigger>
					<TabsTrigger 
						value="past" 
						className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
					>
						Past Sessions
					</TabsTrigger>
				</TabsList>

				<TabsContent value="upcoming">
					<div className="space-y-4">
						{upcomingSessions.length === 0 ? (
							<p className="text-center text-gray-500">No upcoming sessions</p>
						) : (
							upcomingSessions.map(session => (
								<SessionCard key={session.id} session={session} />
							))
						)}
					</div>
				</TabsContent>

				<TabsContent value="past">
					<div className="space-y-4">
						{pastSessions.length === 0 ? (
							<p className="text-center text-gray-500">No past sessions</p>
						) : (
							pastSessions.map(session => (
								<SessionCard key={session.id} session={session} />
							))
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default BookingHistory;