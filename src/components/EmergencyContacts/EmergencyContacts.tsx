import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import EmergencyFAB from './EmergencyFAB';

import AddContactModal from './AddContactModal';
import ViewContactsModal from './ViewContactsModal';
import PanicButtonModal from './PanicButtonModal';

interface Contact {
	id: string;
	name: string;
	phone: string;
	email?: string;
}

const EmergencyContacts = () => {
	const { toast } = useToast();
	const [contacts, setContacts] = React.useState<Contact[]>(() => {
		const savedContacts = localStorage.getItem('emergencyContacts');
		return savedContacts ? JSON.parse(savedContacts) : [];
	});
	const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
	const [isPanicModalOpen, setIsPanicModalOpen] = React.useState(false);
	const [editingContact, setEditingContact] = React.useState<Contact | null>(null);

	const handleAddContact = (contactData: Omit<Contact, 'id'>) => {
		if (editingContact) {
			// Update existing contact
			setContacts((prev) =>
				prev.map((contact) =>
					contact.id === editingContact.id
						? { ...contactData, id: editingContact.id }
						: contact
				)
			);
			toast({
				title: 'Contact Updated',
				description: `${contactData.name}'s information has been updated.`,
				duration: 1000,
			});
		} else {
			// Add new contact
			const newContact = {
				...contactData,
				id: uuidv4(),
			};
			setContacts((prev) => [...prev, newContact]);
			toast({
				title: 'Contact Added',
				description: `${contactData.name} has been added to your emergency contacts.`,
				duration: 1000,
			});
		}
	};

	const handleEditContact = (contact: Contact) => {
		setEditingContact(contact);
		setIsAddModalOpen(true);
		setIsViewModalOpen(false);
	};

	const handleDeleteContact = (id: string) => {
		setContacts((prev) => prev.filter((contact) => contact.id !== id));
		toast({
			title: 'Contact Deleted',
			description: 'The contact has been removed from your emergency contacts.',
			duration: 1000,
		});
	};

	const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

	useEffect(() => {
		// Get user's location when component mounts
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				(error) => {
					console.error('Error getting location:', error);
				}
			);
		}
	}, []);

	const handlePanicButton = () => {
		if (contacts.length === 0) {
			toast({
				title: 'No Emergency Contacts',
				description: 'Please add emergency contacts before using the panic button.',
				variant: 'destructive',
				duration: 1000,
			});
			return;
		}

		toast({
			title: 'Emergency Alert Sent',
			description: 'Your emergency contacts would be notified with your location.',
			variant: 'destructive',
			duration: 1000,
		});
		setIsPanicModalOpen(false);

		contacts.forEach(contact => {
			console.log(`Mock Alert: Would send to ${contact.name} (${contact.phone})`);
		});
	};

	React.useEffect(() => {
		localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
	}, [contacts]);

	return (
		<>
			<EmergencyFAB
				onAddContact={() => {
					setEditingContact(null);
					setIsAddModalOpen(true);
				}}
				onViewContacts={() => setIsViewModalOpen(true)}
				onPanicButton={() => setIsPanicModalOpen(true)}
			/>

			<AddContactModal
				isOpen={isAddModalOpen}
				onClose={() => {
					setIsAddModalOpen(false);
					setEditingContact(null);
				}}
				onSave={handleAddContact}
				editingContact={editingContact}
			/>

			<ViewContactsModal
				isOpen={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
				contacts={contacts}
				onEdit={handleEditContact}
				onDelete={handleDeleteContact}
			/>

			<PanicButtonModal
				isOpen={isPanicModalOpen}
				onClose={() => setIsPanicModalOpen(false)}
				onConfirm={handlePanicButton}
			/>
		</>
	);
};

export default EmergencyContacts;