'use client';

import { Button } from "@/components/ui/button";

const CATEGORIES = [
  'Politics',
  'Sports',
  'Finance',
  'Crypto',
  'Geopolitics',
  'Earnings',
  'Tech',
  'Culture',
  'World',
  'Economy',
  'Elections',
  'Mentions',
];

interface CategoryFiltersProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

export default function CategoryFilters({ selectedCategories, onCategoryToggle }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <Button
            key={category}
            onClick={() => onCategoryToggle(category)}
            className={`
              px-3 py-1.5 text-xs md:text-sm rounded-sm transition-all duration-200 font-medium
              ${isSelected 
                ? 'bg-gray-200 shadow-[inset_0_3px_6px_rgba(0.1,0.1,0.1,0.1)] translate-y-[2px] hover:bg-gray-200 text-black' 
                : 'bg-white text-black hover:bg-gray-200 active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:bg-gray-200 border-0'
              }
            `}
          >
            {category.toLowerCase()}
          </Button>
        );
      })}
    </div>
  );
}