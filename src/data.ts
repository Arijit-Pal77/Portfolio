import { Project, Education } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'plant-disease',
    moduleCode: 'MODULE: CV_084',
    title: 'Plant Disease Detection',
    description: 'An advanced deep learning system utilizing the EfficientNet architecture to identify botanical pathogens with 98.4% accuracy. Designed for real-time edge deployment.',
    extendedDescription: 'This project implements an end-to-end computer vision pipeline that processes high-resolution leaf imagery to identify diseases. Using PyTorch, the system utilizes transfer learning with EfficientNet-B4, fine-tuned on a custom dataset of 38 plant-pathogen pairs. It features automated preprocessing, real-time inferencing with FastAPI, and optimized model compression via ONNX for seamless deployment on low-power edge nodes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7-ON0SpuA24P3UA3RK4zlsZZODnSbiClTPuj5bPW0ybVxJNvXC1KOrcIgZCiTbaFPcj3XAGwtDDRGZIrmmi5mu1QyKkCHlPvwUNiUvVApeP6isMuyGot0WchUtFzPsB3HRFcgtwzt6fLOM0rJnIAmAzNyPQdFvE70zachIMAv8dRfDz3D9NDOqfBfgtIpQ4jjhtiTeVQZa3bwjjNiFDNNrs8vryfazqcGlmb5Y599LZnx694J1W69cSrmWUg2YX7VEnsfPhGCONn',
    tags: ['PyTorch', 'FastAPI', 'EfficientNet-B4'],
    type: 'ml'
  },
  {
    id: 'video-captioner',
    moduleCode: 'MODULE: AI_CAP_02',
    title: 'AI Video Captioner',
    description: 'Generative AI tool that automates accessibility by creating context-aware captions using Whisper and GPT-4.',
    extendedDescription: 'A full-stack automation tool designed to generate highly accurate captions for video uploads. The backend uses OpenAI Whisper to run speech-to-text transcribing and speaker diarization. The resulting transcripts are processed with GPT-4 to add context-aware capitalization, correct industry jargon, and format sub-second timestamps. Interactive frontend controls allow real-time playback, subtitle edits, and exports to SRT or VTT formats.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAtJHOwTqPZOcLYIKovj21YF8TMW0ITyQcwhBIzELBH3Hg5r_Znr1WCpoFdwPtTidldGJaNwL1AebK_CSk2r8hkHNlD_Xr6a4bMxkZBNabVQ0dd8n5EeFzUxhAEz0ABBmr7BvhPBpHGZE6HpUllDwiVpviT85-KNMEy2CBEcP0vYEBx_pUlW2lnDEd8dm2jAxFLopGgzp_SeNpQ_zQeUlCsCxKoYAC5OxJgnsClfkAAlRPAxQTrJUdOoO4mEothjHdCbBNWfcAwFgG',
    tags: ['Whisper', 'GPT-4', 'Vite'],
    type: 'ml'
  },
  {
    id: 'auto-wisher',
    moduleCode: 'ID: BOT_WISH_01',
    title: 'Automatic Wisher',
    description: 'A seamless automation script that monitors databases and dispatches personalized emails and messages automatically.',
    extendedDescription: 'An automated background worker utility that synchronizes with user databases to dynamically formulate personalized birthday, anniversary, and holiday greetings. Leveraging pandas for tabular parsing and secure SMTP pipelines, the tool compiles customizable templates, attaches optimized graphic assets, and tracks email delivery logs with detailed success rates.',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800',
    tags: ['Pandas', 'SMTP', 'Python'],
    type: 'automation'
  },
  {
    id: 'python-snake',
    moduleCode: '01 LOGIC PROJECT',
    title: 'Python Snake',
    description: 'A nostalgic recreation of the classic arcade game featuring customized physics and an adaptive difficulty algorithm.',
    extendedDescription: 'An interactive, fully functional classic Snake game. It features dynamic obstacle routing, sound effects, scoring grids, and an adaptive velocity algorithm that scales the snake speed based on player performance. It provides high-intensity nostalgic engagement with retro styling.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    tags: ['PyGame', 'Python', 'Retro Physics'],
    type: 'game'
  },
  {
    id: 'tictactoe-ai',
    moduleCode: 'ID: BOT_TTT_02',
    title: 'Tic Tac Toe AI',
    description: 'Implementation of the Minimax algorithm to create an unbeatable opponent in the classic game of strategy.',
    extendedDescription: 'An unbeatable AI bot that utilizes the classic Minimax algorithm with Alpha-Beta pruning. It evaluates game states recursively in real-time to always find the optimal move. Features an interactive cyberpunk playground where the user can test their strategic limits against the system.',
    image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&q=80&w=800',
    tags: ['Minimax', 'Heuristic Evaluation', 'Algorithmic Theory'],
    type: 'game'
  }
];

export const EDUCATION_MILESTONES: Education[] = [
  {
    period: '2025 - 2029',
    degree: 'Bachelor of Engineering',
    specialization: 'COMPUTER SCIENCE & ENGINEERING (AI & ML)',
    institution: 'Chandigarh University',
    description: 'Currently pursuing a specialization in Artificial Intelligence and Machine Learning. Immersed in core CS fundamentals while exploring advanced topics like neural networks, statistical modeling, and data structures.',
    skills: ['Mathematics', 'Python', 'Data Analytics']
  }
];

export const PROFILE_DETAILS = {
  name: 'ARIJIT PAL',
  role: 'Computer Science Engineering Student | AI & Machine Learning Enthusiast',
  bio: 'Building intelligent systems and solving real-world problems through code. Passionate about leveraging neural networks and data analytics to create meaningful impact.',
  extendedBio: "My journey in Computer Science is fueled by a profound curiosity for how machines learn and adapt. I don't just write code; I design systems that bridge the gap between raw data and actionable intelligence.",
  location: {
    lat: '22.5726° N',
    lng: '88.3639° E'
  },
  avatar: '/Photos/avatar.jpeg',
  socials: {
    github: 'https://github.com/Arijit-Pal77',
    linkedin: 'https://www.linkedin.com/in/arijit-pal-23a43b378/',
    x: 'https://x.com',
    email: 'mailto:arijitpal2350@gmail.com',
    phone: 'tel:+919832434164'
  }
};
