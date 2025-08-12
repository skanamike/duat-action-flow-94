import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loaded');
console.log('Root element:', document.getElementById("root"));

const root = document.getElementById("root");
if (!root) {
  console.error('Root element not found!');
} else {
  console.log('Creating React root...');
  createRoot(root).render(<App />);
  console.log('React app rendered');
}
