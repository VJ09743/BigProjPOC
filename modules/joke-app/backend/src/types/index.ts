// =============================================================================
// Database Model Types for Joke Web Application
// =============================================================================

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color_hex: string;
    icon_name: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateCategoryRequest {
    name: string;
    slug: string;
    description?: string;
    color_hex?: string;
    icon_name?: string;
    sort_order?: number;
}

export interface Joke {
    id: number;
    category_id: number;
    setup: string;
    punchline: string;
    content_rating: 'G' | 'PG' | 'PG-13';
    source: string;
    is_approved: boolean;
    is_featured: boolean;
    view_count: number;
    rating_sum: number;
    rating_count: number;
    created_at: string;
    updated_at: string;
}

export interface CreateJokeRequest {
    category_id: number;
    setup: string;
    punchline: string;
    content_rating?: 'G' | 'PG' | 'PG-13';
    source?: string;
}

export interface JokeWithDetails {
    id: number;
    setup: string;
    punchline: string;
    content_rating: string;
    is_featured: boolean;
    view_count: number;
    avg_rating: number;
    rating_count: number;
    created_at: string;
    category_name: string;
    category_slug: string;
    category_color: string;
    category_icon: string;
}

export interface UserSession {
    id: string; // UUID
    created_at: string;
    last_active: string;
    preferences: string; // JSON string
}

export interface UserPreferences {
    favoriteCategories?: string[];
    theme?: 'light' | 'dark';
    language?: string;
    showRatings?: boolean;
}

export interface UserRating {
    id: number;
    session_id: string;
    joke_id: number;
    rating: 1 | 2 | 3 | 4 | 5;
    created_at: string;
}

export interface CreateRatingRequest {
    session_id: string;
    joke_id: number;
    rating: 1 | 2 | 3 | 4 | 5;
}

export interface UserFavorite {
    id: number;
    session_id: string;
    joke_id: number;
    created_at: string;
}

export interface CreateFavoriteRequest {
    session_id: string;
    joke_id: number;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: PaginationMeta;
    timestamp: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    query?: string;
    searchType?: string;
    type?: string;
}

// =============================================================================
// Query Parameters and Filters
// =============================================================================

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface JokeQueryParams extends PaginationParams {
    category?: string; // category slug
    rating?: number; // minimum rating
    featured?: boolean;
    search?: string;
    sort?: 'newest' | 'oldest' | 'rating' | 'popular' | 'random';
}

export interface SearchParams extends PaginationParams {
    query: string;
    category?: string;
    content_rating?: string[];
}

export interface SearchQueryParams extends PaginationParams {
    q?: string;
    category?: string;
    min_rating?: string | number;
    type?: 'all' | 'content' | 'title';
    featured?: string | boolean;
}

// =============================================================================
// Statistics and Analytics Types
// =============================================================================

export interface CategoryStats {
    category_id: number;
    category_name: string;
    joke_count: number;
    avg_rating: number;
    total_views: number;
}

export interface PopularityStats {
    most_viewed_jokes: JokeWithDetails[];
    highest_rated_jokes: JokeWithDetails[];
    category_stats: CategoryStats[];
}

// =============================================================================
// Utility Types
// =============================================================================

export type SortOrder = 'ASC' | 'DESC';

export interface SortOption {
    field: string;
    order: SortOrder;
}

export type ContentRating = 'G' | 'PG' | 'PG-13';

export type JokeSource = 'manual' | 'api' | 'user_submission' | 'seeded';

// =============================================================================
// Database Query Result Types
// =============================================================================

export interface DbResult {
    changes: number;
    lastID?: number;
}

export interface JokeSearchResult {
    joke_id: number;
    setup: string;
    punchline: string;
    rank: number; // FTS5 relevance score
}