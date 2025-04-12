
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface TechniqueCardHeaderProps {
  title: string;
  description: string;
  category: 'focus' | 'organization' | 'sensory' | 'social';
  source?: string;
  researchBased?: boolean;
}

const categoryColors = {
  focus: 'bg-blue-500/10 text-blue-600',
  organization: 'bg-purple-500/10 text-purple-600',
  sensory: 'bg-green-500/10 text-green-600',
  social: 'bg-yellow-500/10 text-yellow-600',
};

const TechniqueCardHeader: React.FC<TechniqueCardHeaderProps> = ({
  title,
  description,
  category,
  source,
  researchBased = false,
}) => {
  // Function to create a search URL for the journal
  const getJournalSearchUrl = (journalName: string) => {
    const encodedJournal = encodeURIComponent(journalName);
    return `https://scholar.google.com/scholar?q=${encodedJournal}`;
  };

  return (
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${categoryColors[category]}`}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
        {researchBased && (
          <span className="bg-accent/10 text-accent text-xs font-medium px-2.5 py-0.5 rounded">
            Research-based
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      {source && (
        <a 
          href={getJournalSearchUrl(source)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center mt-auto transition-colors"
        >
          <ExternalLink size={12} className="mr-1" /> {source}
        </a>
      )}
    </div>
  );
};

export default TechniqueCardHeader;
