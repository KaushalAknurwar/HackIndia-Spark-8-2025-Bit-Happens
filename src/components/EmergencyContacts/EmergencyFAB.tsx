import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Plus, AlertCircle, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyFABProps {
	onAddContact: () => void;
	onViewContacts: () => void;
	onPanicButton: () => void;
}

const EmergencyFAB = ({ onAddContact, onViewContacts, onPanicButton }: EmergencyFABProps) => {
	const [isOpen, setIsOpen] = React.useState(false);

	const menuItems = [
		{ icon: <Plus className="w-5 h-5" />, label: 'Add Contact', onClick: onAddContact },
		{ icon: <List className="w-5 h-5" />, label: 'View Contacts', onClick: onViewContacts },
		{ icon: <AlertCircle className="w-5 h-5" />, label: 'Panic Button', onClick: onPanicButton },
	];

	return (
		<div className="fixed bottom-[104px] right-8 z-50">
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="mb-2 flex flex-col gap-2"
					>
						{menuItems.map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ delay: index * 0.1 }}
							>
								<Button
									variant="secondary"
									className="flex items-center gap-2 w-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-white/10 text-white"
									onClick={() => {
										setIsOpen(false);
										item.onClick();
									}}
								>
									{item.icon}
									<span>{item.label}</span>
								</Button>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
			<motion.div
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
			>
				<Button
					size="icon"
					className="w-[56px] h-[56px] rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
					onClick={() => setIsOpen(!isOpen)}
				>
					<Phone className="w-6 h-6" />
				</Button>
			</motion.div>
		</div>
	);
};

export default EmergencyFAB;