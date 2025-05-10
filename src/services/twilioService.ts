import axios from 'axios';

interface EmergencyMessage {
	name: string;
	phone: string;
	situation: string;
}

export const sendEmergencyNotification = async (data: EmergencyMessage): Promise<boolean> => {
	try {
		const response = await axios.post('/api/emergency', data);
		return response.data.success;
	} catch (error) {
		console.error('Failed to send emergency notification:', error);
		return false;
	}
};

