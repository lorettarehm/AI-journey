
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon } from "lucide-react";

interface AIRecommendationCardProps {
  recommendation: {
    technique: {
      title: string;
      description: string;
    };
    recommendation: string;
  };
}

const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ recommendation }) => {
  return (
    <Card className="border-accent/50 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <SparklesIcon className="mr-2 text-accent" />
          <CardTitle className="text-lg">Personalized Technique</CardTitle>
        </div>
        <CardDescription>
          Custom-tailored recommendation based on your unique profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-2">{recommendation.technique.title}</h3>
        <p className="text-muted-foreground mb-4">{recommendation.technique.description}</p>
        <div className="bg-accent/5 p-4 rounded-lg">
          <p className="italic">{recommendation.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationCard;
