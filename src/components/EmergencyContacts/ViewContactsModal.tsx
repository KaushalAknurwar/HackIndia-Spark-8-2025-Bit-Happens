import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface Contact {
	id: string;
	name: string;
	phone: string;
	email?: string;
}

interface ViewContactsModalProps {
	isOpen: boolean;
	onClose: () => void;
	contacts: Contact[];
	onEdit: (contact: Contact) => void;
	onDelete: (id: string) => void;
}

const ViewContactsModal = ({
	isOpen,
	onClose,
	contacts,
	onEdit,
	onDelete,
}: ViewContactsModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px] bg-black/40 backdrop-blur-md border border-white/20">
				<DialogHeader>
					<DialogTitle className="text-white">Emergency Contacts</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					{contacts.length === 0 ? (
						<p className="text-center text-white/60">No contacts added yet</p>
					) : (
						contacts.map((contact) => (
							<div
								key={contact.id}
								className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10 backdrop-blur-md"
							>
								<div className="space-y-1">
									<h4 className="font-medium text-white">{contact.name}</h4>
									<p className="text-sm text-white/60">{contact.phone}</p>
									{contact.email && (
										<p className="text-sm text-white/60">{contact.email}</p>
									)}
								</div>
								<div className="flex gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => onEdit(contact)}
										className="text-white hover:bg-white/10"
									>
										<Edit2 className="w-4 h-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="text-red-400 hover:text-red-500 hover:bg-white/10"
										onClick={() => onDelete(contact.id)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ViewContactsModal;