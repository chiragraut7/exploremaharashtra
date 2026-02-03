export interface ModalSection {
  type: 'h4' | 'h5' | 'p' | 'ul' | 'html';
  text?: string;
  items?: string[];
  html?: string;
  class?: string;
}

export interface ModalData {
  id: string;
  title: string;
  year?: string;          // For the sidebar
  location?: string;      // For the sidebar
  mainImage?: string;     // High-res hero image
  sections?: ModalSection[];
  // Keep support for legacy format if needed
  [key: string]: any; 
}