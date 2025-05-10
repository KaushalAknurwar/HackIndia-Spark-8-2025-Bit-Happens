import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HeartHandshake, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TherapistListing from './TherapistListing';
import BookingHistory from './BookingHistory';
import EmergencyBooking from './EmergencyBooking';

export interface Therapist {
	id: string;
	name: string;
	specialization: string[];
	availability: string[];
	rating: number;
	experience: number;
	price: number;
	image: string;
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

const Sahayak: React.FC = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('therapists');

	useEffect(() => {
		const script = document.createElement("script");

		const clientWidth = document.body.clientWidth;
		const dynamicStyles =
			clientWidth < 540
				? "height: 266px; width: 96%; left: 50%; transform: translateX(-50%);"
				: "height: 366px; width: calc(366px * 16 / 9);";

		script.innerHTML = `
			!function(window){
				const host="https://labs.heygen.com",
				url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJBbm5fVGhlcmFwaXN0X3B1YmxpYyIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3YzLzc1ZTBhODdiN2ZkOTRmMDk4MWZmMzk4YjU5M2RkNDdmXzQ1NTcwL3ByZXZpZXdfdGFsa180LndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6IjRlYmQ0MTFjMWZhMTQ2YjhhNTc4OGUzNDliZTM5NWZkIiwidXNlcm5hbWUiOiIxMmI1NmRhODA5MDk0MDM1YmU3MDI0NDBhMjczMTVlYyJ9&inIFrame=1";

				const wrapDiv = document.createElement("div");
				wrapDiv.id = "heygen-streaming-embed";

				const container = document.createElement("div");
				container.id = "heygen-streaming-container";

				const stylesheet = document.createElement("style");
				stylesheet.innerHTML = \`
					#heygen-streaming-embed {
						z-index: 9999;
						position: fixed;
						left: 40px;
						bottom: 40px;
						width: 200px;
						height: 200px;
						border-radius: 50%;
						border: 2px solid #fff;
						box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
						transition: all linear 0.1s;
						overflow: hidden;
						opacity: 0;
						visibility: hidden;
					}
					#heygen-streaming-embed.show {
						opacity: 1;
						visibility: visible;
					}
					#heygen-streaming-embed.expand {
						${dynamicStyles}
						border: 0;
						border-radius: 8px;
					}
					#heygen-streaming-container {
						width: 100%;
						height: 100%;
					}
					#heygen-streaming-container iframe {
						width: 100%;
						height: 100%;
						border: 0;
					}
				\`;

				const iframe = document.createElement("iframe");
				iframe.allowFullscreen = false;
				iframe.title = "Streaming Embed";
				iframe.role = "dialog";
				iframe.allow = "microphone";
				iframe.src = url;

				let visible = false, initial = false;

				window.addEventListener("message", (e) => {
					if (e.origin === host && e.data?.type === "streaming-embed") {
						if (e.data.action === "init") {
							initial = true;
							wrapDiv.classList.toggle("show", initial);
						} else if (e.data.action === "show") {
							visible = true;
							wrapDiv.classList.toggle("expand", visible);
						} else if (e.data.action === "hide") {
							visible = false;
							wrapDiv.classList.toggle("expand", visible);
						}
					}
				});

				container.appendChild(iframe);
				wrapDiv.appendChild(stylesheet);
				wrapDiv.appendChild(container);
				document.body.appendChild(wrapDiv);
			}(globalThis);
		`;

		document.body.appendChild(script);

		return () => {
			script.remove();
			document.getElementById("heygen-streaming-embed")?.remove();
		};
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A1F3C] px-4 py-6 sm:p-6 text-white"
		>
			<Button
				onClick={() => navigate('/dashboard')}
				className="mb-6 bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white"
			>
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Dashboard
			</Button>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="max-w-6xl mx-auto space-y-8"
			>
				<motion.div
					className="text-center mb-12 animate-fade-in relative"
					variants={item}
				>
					<div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 blur-3xl -z-10" />
					<motion.h1
						className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent mb-4"
						variants={item}
					>
						Sahayak - Mental Health Support
						<motion.span
							animate={{
								rotate: [0, 10, -10, 0],
								scale: [1, 1.2, 1]
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatType: "reverse"
							}}
							className="inline-block ml-2"
						>
							<HeartHandshake className="w-8 h-8 text-[#D946EF]" />
						</motion.span>
					</motion.h1>
					<motion.p
						className="text-lg sm:text-xl text-gray-300 mb-6"
						variants={item}
					>
						Connect with mental health professionals and get the support you need
					</motion.p>
				</motion.div>

				<motion.div variants={item}>
					<Tabs defaultValue="therapists" className="w-full">
						<TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-lg border border-white/10">
							<TabsTrigger 
								value="therapists" 
								className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
							>
								Find Therapist
							</TabsTrigger>
							<TabsTrigger 
								value="bookings" 
								className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
							>
								My Bookings
							</TabsTrigger>
							<TabsTrigger 
								value="emergency" 
								className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
							>
								Emergency Support
							</TabsTrigger>
						</TabsList>

						<TabsContent value="therapists">
							<Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4">
								<TherapistListing />
							</Card>
						</TabsContent>

						<TabsContent value="bookings">
							<Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4">
								<BookingHistory />
							</Card>
						</TabsContent>

						<TabsContent value="emergency">
							<Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4">
								<EmergencyBooking />
							</Card>
						</TabsContent>
					</Tabs>
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default Sahayak;
