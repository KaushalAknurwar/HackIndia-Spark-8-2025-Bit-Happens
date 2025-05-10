import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const contactSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
	email: z.string().email('Invalid email').optional().or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface Contact extends ContactFormData {
	id: string;
}

interface AddContactModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (contact: ContactFormData) => void;
	editingContact: Contact | null;
}

const AddContactModal = ({ isOpen, onClose, onSave, editingContact }: AddContactModalProps) => {
	const form = useForm<ContactFormData>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			name: '',
			phone: '',
			email: '',
		},
	});

	useEffect(() => {
		if (editingContact) {
			form.reset({
				name: editingContact.name,
				phone: editingContact.phone,
				email: editingContact.email || '',
			});
		} else {
			form.reset({
				name: '',
				phone: '',
				email: '',
			});
		}
	}, [editingContact, form]);

	const onSubmit = (data: ContactFormData) => {
		onSave(data);
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px] bg-black/40 backdrop-blur-md border border-white/20">
				<DialogHeader>
					<DialogTitle className="text-white">
						{editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<Label className="text-white">Name</Label>
									<FormControl>
										<Input placeholder="John Doe" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" {...field} />
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<Label className="text-white">Phone Number</Label>
									<FormControl>
										<Input placeholder="+1234567890" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" {...field} />
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<Label className="text-white">Email (Optional)</Label>
									<FormControl>
										<Input placeholder="john@example.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" {...field} />
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={onClose} className="bg-white/10 text-white hover:bg-white/20 border-white/20">
								Cancel
							</Button>
							<Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
								{editingContact ? 'Save Changes' : 'Add Contact'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default AddContactModal;