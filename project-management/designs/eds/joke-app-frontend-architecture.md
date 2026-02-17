# Frontend Architecture Design - Joke Web Application

## Frontend Overview

**Framework**: React 18+ with TypeScript  
**Build Tool**: Vite  
**Styling**: Tailwind CSS + CSS Modules  
**State Management**: React Context + localStorage  
**Routing**: React Router v6  
**Performance**: Code splitting, lazy loading, memoization

## Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   ├── LoadingSpinner/
│   │   ├── ErrorBoundary/
│   │   └── Toast/
│   │
│   ├── layout/          # Layout components  
│   │   ├── Header/
│   │   ├── Navigation/
│   │   ├── Footer/
│   │   └── Layout/
│   │
│   ├── joke/            # Joke-specific components
│   │   ├── JokeCard/
│   │   ├── JokeList/
│   │   ├── RandomJoke/
│   │   ├── JokeRating/
│   │   └── ShareButtons/
│   │
│   ├── search/          # Search functionality
│   │   ├── SearchBar/
│   │   ├── SearchResults/
│   │   ├── CategoryFilter/
│   │   └── SearchSuggestions/
│   │
│   ├── user/            # User interaction components
│   │   ├── FavoritesList/
│   │   ├── SubmissionForm/
│   │   ├── RatingWidget/
│   │   └── UserPreferences/
│   │
│   └── category/        # Category components
│       ├── CategoryCard/
│       ├── CategoryGrid/
│       └── CategoryBadge/
│
├── pages/               # Route components (lazy loaded)
│   ├── HomePage/
│   ├── CategoryPage/
│   ├── SearchPage/
│   ├── FavoritesPage/
│   ├── SubmitJokePage/
│   └── NotFoundPage/
│
├── hooks/               # Custom React hooks
│   ├── useJokes.ts
│   ├── useSearch.ts
│   ├── useFavorites.ts  
│   ├── useRatings.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
│
├── context/             # Global state management
│   ├── JokeContext.tsx
│   ├── UserContext.tsx
│   ├── SearchContext.tsx
│   └── ThemeContext.tsx
│
├── services/            # API client services
│   ├── api.ts           # Base API client
│   ├── jokeService.ts
│   ├── searchService.ts
│   ├── categoryService.ts
│   └── userService.ts
│
├── utils/               # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validation.ts
│   └── formatting.ts
│
├── types/               # TypeScript type definitions
│   ├── joke.types.ts
│   ├── user.types.ts
│   ├── api.types.ts
│   └── common.types.ts
│
└── styles/              # Global styles
    ├── globals.css
    ├── components.css
    └── variables.css
```

## Component Architecture

### 1. Core Component Design Principles

#### Atomic Design Methodology
- **Atoms**: Basic UI elements (Button, Input, Icon)
- **Molecules**: Simple component combinations (SearchBar, RatingWidget)
- **Organisms**: Complex components (JokeList, Navigation)
- **Templates**: Page layouts
- **Pages**: Specific page instances

#### Component Composition Pattern
```tsx
// Example: Composable JokeCard component
<JokeCard>
  <JokeCard.Setup>Why don't scientists trust atoms?</JokeCard.Setup>
  <JokeCard.Punchline>Because they make up everything!</JokeCard.Punchline>
  <JokeCard.Actions>
    <JokeCard.RatingWidget />
    <JokeCard.FavoriteButton />
    <JokeCard.ShareButtons />
  </JokeCard.Actions>
</JokeCard>
```

### 2. Key Component Specifications

#### JokeCard Component
```tsx
interface JokeCardProps {
  joke: Joke;
  showCategory?: boolean;
  showActions?: boolean;
  variant?: 'compact' | 'detailed' | 'featured';
  onRate?: (rating: number) => void;
  onFavorite?: () => void;
  onShare?: (platform: string) => void;
}

const JokeCard: React.FC<JokeCardProps> = ({
  joke,
  showCategory = true,
  showActions = true,
  variant = 'detailed'
}) => {
  return (
    <div className={`joke-card joke-card--${variant}`}>
      {showCategory && (
        <CategoryBadge 
          category={joke.category}
          size="small"
        />
      )}
      
      <div className="joke-content">
        <p className="joke-setup">{joke.setup}</p>
        <p className="joke-punchline">{joke.punchline}</p>
      </div>
      
      {showActions && (
        <div className="joke-actions">
          <RatingWidget 
            rating={joke.avgRating}
            userRating={joke.userRating}
            onRate={onRate}
          />
          <FavoriteButton 
            isFavorite={joke.isUserFavorite}
            onToggle={onFavorite}
          />
          <ShareButtons 
            joke={joke}
            onShare={onShare}
          />
        </div>
      )}
    </div>
  );
};
```

#### SearchBar Component
```tsx
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for jokes...",
  suggestions = [],
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);
  
  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {isLoading && <LoadingSpinner size="small" />}
      {suggestions.length > 0 && (
        <SearchSuggestions 
          suggestions={suggestions}
          onSelect={setQuery}
        />
      )}
    </div>
  );
};
```

## State Management Architecture

### 1. Context Providers

#### JokeContext
```tsx
interface JokeContextState {
  jokes: Joke[];
  categories: Category[];
  currentJoke: Joke | null;
  isLoading: boolean;
  error: string | null;
}

interface JokeContextActions {
  loadJokes: (filters?: JokeFilters) => Promise<void>;
  getRandomJoke: (categorySlug?: string) => Promise<void>;
  rateJoke: (jokeId: number, rating: number) => Promise<void>;
  favoriteJoke: (jokeId: number) => Promise<void>;
  submitJoke: (jokeData: SubmissionData) => Promise<void>;
}

const JokeContext = createContext<JokeContextState & JokeContextActions>();
```

#### UserContext  
```tsx
interface UserContextState {
  sessionId: string;
  favorites: number[];  // Joke IDs
  ratings: Record<number, number>;  // jokeId -> rating
  preferences: UserPreferences;
  submissions: Submission[];
}

interface UserContextActions {
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addFavorite: (jokeId: number) => void;
  removeFavorite: (jokeId: number) => void;
  setRating: (jokeId: number, rating: number) => void;
}
```

### 2. Custom Hooks

#### useJokes Hook
```tsx
const useJokes = (filters?: JokeFilters) => {
  const { jokes, isLoading, loadJokes } = useContext(JokeContext);
  const [filteredJokes, setFilteredJokes] = useState<Joke[]>([]);
  
  useEffect(() => {
    loadJokes(filters);
  }, [filters]);
  
  useEffect(() => {
    // Client-side filtering logic
    setFilteredJokes(applyFilters(jokes, filters));
  }, [jokes, filters]);
  
  return {
    jokes: filteredJokes,
    isLoading,
    refetch: () => loadJokes(filters)
  };
};
```

#### useFavorites Hook
```tsx
const useFavorites = () => {
  const { favorites, addFavorite, removeFavorite } = useContext(UserContext);
  const [favoriteJokes, setFavoriteJokes] = useState<Joke[]>([]);
  
  const toggleFavorite = useCallback(async (jokeId: number) => {
    const isFavorite = favorites.includes(jokeId);
    
    if (isFavorite) {
      await userService.removeFavorite(jokeId);
      removeFavorite(jokeId);
    } else {
      await userService.addFavorite(jokeId);
      addFavorite(jokeId);
    }
  }, [favorites, addFavorite, removeFavorite]);
  
  return {
    favorites: favoriteJokes,
    favoriteCount: favorites.length,
    toggleFavorite,
    isFavorite: (jokeId: number) => favorites.includes(jokeId)
  };
};
```

## Routing & Navigation

### Route Configuration
```tsx
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="submit" element={<SubmitJokePage />} />
        <Route path="joke/:id" element={<JokeDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
```

### Navigation Component
```tsx
const Navigation: React.FC = () => {
  const { categories } = useContext(JokeContext);
  const location = useLocation();
  
  return (
    <nav className="main-navigation">
      <NavLink to="/" className={({ isActive }) => 
        `nav-link ${isActive ? 'nav-link--active' : ''}`
      }>
        Home
      </NavLink>
      
      <div className="categories-dropdown">
        <button className="dropdown-trigger">Categories</button>
        <div className="dropdown-menu">
          {categories.map(category => (
            <NavLink
              key={category.id}
              to={`/category/${category.slug}`}
              className="category-link"
              style={{ '--category-color': category.colorHex }}
            >
              <Icon name={category.iconName} />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      
      <NavLink to="/favorites" className="nav-link">
        Favorites
      </NavLink>
      
      <NavLink to="/submit" className="nav-link">
        Submit Joke
      </NavLink>
    </nav>
  );
};
```

## UI/UX Design System

### 1. Design Tokens
```css
:root {
  /* Colors */
  --color-primary: #3B82F6;
  --color-primary-dark: #1E40AF;
  --color-secondary: #8B5CF6;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  
  /* Typography */
  --font-family-base: 'Inter', -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  
  /* Spacing */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  
  /* Borders */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### 2. Component Styling Strategy

#### CSS Modules + Tailwind
```tsx
// JokeCard.tsx
import styles from './JokeCard.module.css';
import clsx from 'clsx';

const JokeCard: React.FC<JokeCardProps> = ({ joke, variant }) => {
  return (
    <div className={clsx(
      'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow',
      styles.jokeCard,
      styles[`jokeCard--${variant}`]
    )}>
      {/* Component content */}
    </div>
  );
};
```

#### Responsive Design Breakpoints
```css
/* Mobile first approach */
.joke-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .joke-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .joke-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

## Performance Optimization

### 1. Code Splitting & Lazy Loading
```tsx
// Lazy load page components
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'));

// Route-based code splitting
const AppRoutes = () => (
  <Suspense fallback={<PageLoadingSpinner />}>
    <Routes>
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  </Suspense>
);
```

### 2. Memoization Strategy
```tsx
// Memoize expensive components
const JokeCard = memo<JokeCardProps>(({ joke, onRate, onFavorite }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.joke.id === nextProps.joke.id &&
         prevProps.joke.avgRating === nextProps.joke.avgRating;
});

// Memoize callback functions
const JokeList: React.FC = () => {
  const handleRate = useCallback((jokeId: number, rating: number) => {
    // Rating logic
  }, []);
  
  const handleFavorite = useCallback((jokeId: number) => {
    // Favorite logic  
  }, []);
  
  return (
    <div>
      {jokes.map(joke => (
        <JokeCard
          key={joke.id}
          joke={joke}
          onRate={handleRate}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  );
};
```

### 3. Virtual Scrolling for Large Lists
```tsx
const VirtualizedJokeList: React.FC<{ jokes: Joke[] }> = ({ jokes }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={jokes.length}
      itemSize={200}
      itemData={jokes}
    >
      {({ index, style, data }) => (
        <div style={style}>
          <JokeCard joke={data[index]} variant="compact" />
        </div>
      )}
    </FixedSizeList>
  );
};
```

## Accessibility & User Experience

### 1. WCAG 2.1 Compliance
- **Keyboard Navigation**: Full keyboard support for all interactions
- **ARIA Labels**: Proper semantics for screen readers
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Focus Management**: Clear focus indicators and logical tab order

### 2. Progressive Enhancement
```tsx
const ShareButtons: React.FC = ({ joke }) => {
  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);
  
  useEffect(() => {
    setIsNativeShareSupported('share' in navigator);
  }, []);
  
  const handleShare = async () => {
    if (isNativeShareSupported) {
      await navigator.share({
        title: 'Check out this joke!',
        text: `${joke.setup} ${joke.punchline}`,
        url: window.location.href
      });
    } else {
      // Fallback to copy to clipboard
      await navigator.clipboard.writeText(
        `${joke.setup} ${joke.punchline}`
      );
    }
  };
  
  return (
    <button onClick={handleShare} className="share-button">
      {isNativeShareSupported ? 'Share' : 'Copy'}
    </button>
  );
};
```

### 3. Loading States & Error Handling
```tsx
const JokeLoader: React.FC = () => {
  return (
    <div className="joke-skeleton">
      <div className="skeleton-category"></div>
      <div className="skeleton-setup"></div>
      <div className="skeleton-punchline"></div>
      <div className="skeleton-actions"></div>
    </div>
  );
};

const ErrorBoundary: React.FC = ({ children }) => {
  return (
    <ErrorBoundaryBase
      fallback={({ error, resetError }) => (
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>We couldn't load the jokes right now.</p>
          <button onClick={resetError} className="retry-button">
            Try Again
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundaryBase>
  );
};
```

---

**Frontend Architecture Status**: Complete  
**Created by**: Architect Agent  
**Date**: 2026-02-17  
**Performance Target**: <2 second load time, 60fps interactions  
**Next Phase**: Content Management Design