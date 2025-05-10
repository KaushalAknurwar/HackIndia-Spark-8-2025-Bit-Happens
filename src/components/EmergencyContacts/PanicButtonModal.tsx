import React, { useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocationService } from './LocationService';

interface PanicButtonModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const PanicButtonModal = ({ isOpen, onClose, onConfirm }: PanicButtonModalProps) => {
	const { getLocation, getGoogleMapsUrl, isLoading, error, location } = useLocationService();
	const [isLocating, setIsLocating] = useState(false);

	const handleConfirm = async () => {
		try {
			setIsLocating(true);
			await getLocation();
			setIsLocating(false);
		} catch (err) {
			setIsLocating(false);
		}
	};

	const handleSendAlert = () => {
		if (location) {
			onConfirm();
		}
		onClose();
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent className="bg-black/40 backdrop-blur-md border border-white/20">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-white">Emergency Alert Confirmation</AlertDialogTitle>
					<AlertDialogDescription className="text-white/60">
						{isLocating ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="flex items-center gap-2"
							>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Fetching your location...</span>
							</motion.div>
						) : location ? (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="space-y-2"
							>
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4 text-red-400" />
									<span>Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
								</div>
								<a
									href={getGoogleMapsUrl(location)}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
								>
									View on Google Maps
								</a>
								<div className="mt-2">
									Your location will be shared with your emergency contacts. Do you want to proceed?
								</div>
							</motion.div>
						) : error ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-red-400"
							>
								{error}
								<Button
									variant="link"
									className="text-blue-400 hover:text-blue-300 pl-2"
									onClick={handleConfirm}
								>
									Retry
								</Button>
							</motion.div>
						) : (
							<span>Click 'Locate Me' to share your location with emergency contacts.</span>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/20">
						Cancel
					</AlertDialogCancel>
					{location ? (
						<AlertDialogAction
							onClick={handleSendAlert}
							className="bg-red-500 hover:bg-red-600 text-white"
							disabled={!location}
						>
							Send Alert
						</AlertDialogAction>
					) : (
						<Button
							onClick={handleConfirm}
							className="bg-red-500 hover:bg-red-600 text-white"
							disabled={isLocating}
						>
							{isLocating ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin mr-2" />
									Locating...
								</>
							) : (
								'Locate Me'
							)}
						</Button>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default PanicButtonModal;