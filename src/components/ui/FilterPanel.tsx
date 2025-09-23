// components/ui/FilterPanel.tsx
"use client";
import React, { useState } from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Users, 
  Calendar, 
  Clock, 
  Heart,
  Hash,
  ChevronDown,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOptions {
  search: string;
  category: string;
  technology: string;
  favorite: boolean | null;
  teamSizeMin: number | null;
  teamSizeMax: number | null;
  durationMin: number | null;
  durationMax: number | null;
  year: number | null;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  availableTechnologies: string[];
  availableYears: number[];
  resultsCount: number;
  totalCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableTechnologies,
  availableYears,
  resultsCount,
  totalCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      technology: '',
      favorite: null,
      teamSizeMin: null,
      teamSizeMax: null,
      durationMin: null,
      durationMax: null,
      year: null
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== false
  );

  return (
    <div className="space-y-6">
      {/* Résultats et statistiques */}
      <div className="text-center animate-fade-in">
        <p className="text-sm text-gray-600">
          {resultsCount} projet{resultsCount > 1 ? 's' : ''} affiché{resultsCount > 1 ? 's' : ''} 
          {totalCount !== resultsCount && ` sur ${totalCount} au total`}
        </p>
      </div>

      {/* Barre de recherche principale */}
      <div className="relative animate-slide-up">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par titre, description ou technologie..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filtres rapides par catégorie */}
      <div className="flex flex-wrap gap-2 animate-slide-up animation-delay-1">
        <button
          onClick={() => updateFilter('category', '')}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
            filters.category === ''
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
          }`}
        >
          Toutes les catégories
        </button>
        {availableCategories.map((category, index) => (
          <button
            key={category}
            onClick={() => updateFilter('category', category)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
              filters.category === category
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
            }`}
            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Boutons de contrôle */}
      <div className="flex items-center justify-between animate-slide-up animation-delay-2">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
            showAdvanced
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtres avancés</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <X className="w-4 h-4" />
            <span>Effacer tout</span>
          </button>
        )}
      </div>

      {/* Filtres avancés */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        showAdvanced ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Filtre technologie */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Technologie</span>
              </label>
              <Select 
                value={filters.technology || "all"} 
                onValueChange={(value) => updateFilter('technology', value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les technologies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les technologies</SelectItem>
                  {availableTechnologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre favoris */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Projets phares</span>
              </label>
              <Select 
                value={filters.favorite === null ? 'all' : filters.favorite.toString()} 
                onValueChange={(value) => updateFilter('favorite', 
                  value === 'all' ? null : value === 'true'
                )}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les projets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les projets</SelectItem>
                  <SelectItem value="true">Projets phares seulement</SelectItem>
                  <SelectItem value="false">Projets non phares</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre année */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Année</span>
              </label>
              <Select 
                value={filters.year?.toString() || "all"} 
                onValueChange={(value) => updateFilter('year', 
                  value === "all" ? null : parseInt(value)
                )}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtres de plage */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Taille d'équipe */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Taille d'équipe</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="1"
                  value={filters.teamSizeMin || ''}
                  onChange={(e) => updateFilter('teamSizeMin', 
                    e.target.value ? parseInt(e.target.value) : null
                  )}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="1"
                  value={filters.teamSizeMax || ''}
                  onChange={(e) => updateFilter('teamSizeMax', 
                    e.target.value ? parseInt(e.target.value) : null
                  )}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Durée */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Durée (mois)</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="1"
                  value={filters.durationMin || ''}
                  onChange={(e) => updateFilter('durationMin', 
                    e.target.value ? parseInt(e.target.value) : null
                  )}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="1"
                  value={filters.durationMax || ''}
                  onChange={(e) => updateFilter('durationMax', 
                    e.target.value ? parseInt(e.target.value) : null
                  )}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags des filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {filters.search && (
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm animate-scale-in">
              <span>Recherche: "{filters.search}"</span>
              <button 
                onClick={() => updateFilter('search', '')}
                className="hover:scale-110 transition-transform duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {filters.category && (
            <div className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm animate-scale-in animation-delay-1">
              <span>Catégorie: {filters.category}</span>
              <button 
                onClick={() => updateFilter('category', '')}
                className="hover:scale-110 transition-transform duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {filters.technology && (
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm animate-scale-in animation-delay-2">
              <span>Tech: {filters.technology}</span>
              <button 
                onClick={() => updateFilter('technology', '')}
                className="hover:scale-110 transition-transform duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {filters.favorite === true && (
            <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm animate-scale-in animation-delay-3">
              <span>Projets phares</span>
              <button 
                onClick={() => updateFilter('favorite', null)}
                className="hover:scale-110 transition-transform duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};