export type TabId = 'home' | 'about' | 'education' | 'projects' | 'terminal' | 'contact';

export interface Project {
  id: string;
  moduleCode: string;
  title: string;
  description: string;
  extendedDescription?: string;
  image: string;
  tags: string[];
  type: 'ml' | 'automation' | 'game' | 'web';
}

export interface Education {
  period: string;
  degree: string;
  specialization: string;
  institution: string;
  description: string;
  skills: string[];
}

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}
