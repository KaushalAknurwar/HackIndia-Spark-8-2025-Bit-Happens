import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2, Paintbrush } from 'lucide-react';
import { useJournal } from '@/contexts/JournalContext';
import { generateImage } from '@/services/imageService.ts';

interface SatrangProps {
	className?: string;
}

export function Satrang({ className }: SatrangProps) {
	const { toast } = useToast();
	const { addEntry } = useJournal();
	const [journalEntry, setJournalEntry] = useState('');
	const [generatedImage, setGeneratedImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [prompt, setPrompt] = useState('');
	
	const handleGenerateImage = async () => {
		if (!prompt.trim()) {
			alert('Please enter a prompt!');
			return;
		}

		setIsLoading(true);

		try {
			const image = await generateImage({
				prompt,
			});

			setGeneratedImage(image);
			toast({
				title: "Art Generated Successfully",
				description: "Your artwork has been created.",
				variant: "default"
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to generate art",
				variant: "destructive"
			});
		} finally {
			setIsLoading(false);
		}
	};
	

	const handleSave = () => {
		if (!generatedImage) return;

		addEntry({
			type: 'drawing',
			content: generatedImage,
			mood: 'neutral',
			title: 'Satrang Art',
			description: journalEntry,
			privacy: 'private'
		});

		setGeneratedImage(null);
		setJournalEntry('');
	};

	return (
		<div className={`p-8 ${className} min-h-screen bg-black/40 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5`}>
			<div className="max-w-4xl mx-auto backdrop-blur-md bg-black/40 rounded-xl p-8 border border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300">
				<div className="flex items-center gap-3 mb-8">
					<Paintbrush className="w-8 h-8 text-[#D946EF]" />
					<h2 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
						Satrang
					</h2>
				</div>

				<div className="space-y-6">
					<div className="space-y-6">
						<div className="relative backdrop-blur-sm bg-black/20 rounded-xl border border-white/20">
							<Textarea
								placeholder="Describe what you want to create..."
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								className="min-h-[120px] resize-none bg-transparent border-none text-white placeholder:text-white/40 text-lg focus:ring-0 rounded-lg p-4"
							/>
						</div>

						<div className="flex gap-4">
							<Button
								onClick={handleGenerateImage}
								disabled={isLoading || !prompt.trim()}
								className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white border-0 rounded-xl h-12 shadow-lg hover:opacity-90 transition-all duration-300"
							>
								{isLoading ? (
									<>
										<Loader2 className="animate-spin mr-2" />
										Generating...
									</>
								) : (
									'Generate Art'
								)}
							</Button>
							
							{generatedImage && (
								<Button
									onClick={handleSave}
									variant="outline"
									className="flex-shrink-0 bg-black/20 border-green-500/30 text-green-400 hover:bg-black/30 hover:text-green-300 rounded-xl h-12 shadow-lg transition-all duration-300"
								>
									<Save className="w-4 h-4 mr-2" />
									Save Art
								</Button>
							)}
						</div>
					</div>

					{generatedImage && (
						<div className="mt-8 rounded-xl overflow-hidden border border-white/20 shadow-lg backdrop-blur-sm bg-black/20">
							<img
								src={generatedImage}
								alt="Generated artwork"
								className="w-full h-auto"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Satrang;
