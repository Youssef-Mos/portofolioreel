// hooks/useApi.ts
import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  totalCount?: number;
  filters?: any;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  totalCount?: number;
  filters?: any;
}

export function useApi<T>(endpoint: string): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [filters, setFilters] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(endpoint);
      const result: ApiResponse<T> = await response.json();
      
      if (result.success) {
        setData(result.data);
        setTotalCount(result.totalCount);
        setFilters(result.filters);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    totalCount,
    filters
  };
}

// Interface pour les filtres de projets
export interface ProjectFilters {
  category?: string;
  technology?: string;
  search?: string;
  favorite?: boolean;
  teamSizeMin?: number;
  teamSizeMax?: number;
  durationMin?: number;
  durationMax?: number;
  year?: number;
  sortBy?: 'title' | 'teamSize' | 'duration' | 'favorite' | 'startDate';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  keywords?: string;
}

// Hook spécifique pour les projets avec filtres
export function useProjects(filters?: ProjectFilters) {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'keywords' && Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }
  
  const endpoint = `/api/projects${params.toString() ? `?${params.toString()}` : ''}`;
  return useApi<any[]>(endpoint);
}

// Hook spécifique pour les expériences
export function useExperiences() {
  return useApi<any[]>('/api/experiences');
}

// Hook spécifique pour les engagements
export function useEngagements() {
  return useApi<any[]>('/api/engagements');
}

// Hook spécifique pour les technologies
export function useTechnologies(category?: string) {
  const endpoint = category ? `/api/technologies?category=${category}` : '/api/technologies';
  return useApi<any>(endpoint);
}

// Hook spécifique pour les statistiques
export function useStats() {
  return useApi<any>('/api/stats');
}