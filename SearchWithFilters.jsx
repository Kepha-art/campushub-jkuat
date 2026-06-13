import React, { useEffect, useState } from 'react';
import create from 'zustand';

const categories = ['clothes', 'food', 'utensils', 'furniture', 'supermarket'];
const locations = ['Gate A', 'Gate B', 'Gate C', 'Juja'];
const priceRange = {
  min: 0,
  max: 20000,
};

const useFilterStore = create((set) => ({
  search: '',
  categoryFilters: [],
  location: '',
  minPrice: priceRange.min,
  maxPrice: priceRange.max,
  setSearch: (search) => set({ search }),
  toggleCategory: (category) =>
    set((state) => {
      const next = state.categoryFilters.includes(category)
        ? state.categoryFilters.filter((item) => item !== category)
        : [...state.categoryFilters, category];
      return { categoryFilters: next };
    }),
  setLocation: (location) => set({ location }),
  setMinPrice: (minPrice) =>
    set((state) => ({ minPrice: Math.min(Number(minPrice), state.maxPrice) })),
  setMaxPrice: (maxPrice) =>
    set((state) => ({ maxPrice: Math.max(Number(maxPrice), state.minPrice) })),
  resetFilters: () =>
    set({
      search: '',
      categoryFilters: [],
      location: '',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    }),
}));

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0] || '/images/comrade/default-product.png';
  const price = product.priceKES ?? product.price ?? 0;

  return (
    <div className="rounded-3xl border border-[var(--jkuat-green-600)]/10 bg-[var(--jkuat-white)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 h-48 overflow-hidden rounded-3xl bg-[var(--jkuat-muted)]">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[var(--jkuat-text)]">{product.name || 'Unnamed product'}</h2>
          <span className="rounded-full bg-[rgba(14,122,54,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--jkuat-green-600)]">
            {product.category || 'Unknown'}
          </span>
        </div>
        <p className="text-sm text-[var(--jkuat-text)]/75 line-clamp-2">
          {product.description || 'No description available.'}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--jkuat-text)]/70">
          <span>KES {price.toLocaleString()}</span>
          <span>{product.campusLocation || 'No location'}</span>
        </div>
      </div>
    </div>
  );
};

const SearchWithFilters = () => {
  const {
    search,
    categoryFilters,
    location,
    minPrice,
    maxPrice,
    setSearch,
    toggleCategory,
    setLocation,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      params.set('search', debouncedSearch);
      params.set('category', categoryFilters.join(','));
      params.set('minPrice', String(minPrice));
      params.set('maxPrice', String(maxPrice));
      if (location) params.set('location', location);

      try {
        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Unable to fetch products');
        }

        const data = await response.json();
        if (!active) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        if (!active) return;
        setError(fetchError.message || 'Failed to load products');
        setProducts([]);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      active = false;
    };
  }, [debouncedSearch, categoryFilters, minPrice, maxPrice, location]);

  return (
    <div className="min-h-screen bg-[var(--jkuat-muted)] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2rem] bg-[var(--jkuat-white)] p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--jkuat-text)]">Marketplace Search</h1>
              <p className="mt-2 text-[var(--jkuat-text)]/80">Search products and refine with category, price, and location filters.</p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center rounded-full border border-[var(--jkuat-green-600)] bg-[var(--jkuat-white)] px-5 py-3 text-sm font-medium text-[var(--jkuat-green-600)] transition hover:bg-[rgba(14,122,54,0.08)]"
            >
              Reset filters
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="rounded-[2rem] border border-[var(--jkuat-green-600)]/30 bg-[var(--jkuat-white)] p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <label htmlFor="search" className="block text-sm font-semibold text-[var(--jkuat-text)]">
                  Search products
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, description, or category"
                  className="mt-3 w-full rounded-3xl border border-[var(--jkuat-green-600)] bg-[var(--jkuat-white)] px-4 py-3 text-sm text-[var(--jkuat-text)] outline-none transition focus:border-[var(--jkuat-green-600)] focus:ring-2 focus:ring-[rgba(14,122,54,0.16)]"
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--jkuat-text)]/70">Category</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3 rounded-3xl border border-[var(--jkuat-green-600)]/30 bg-[var(--jkuat-white)] px-4 py-3 text-sm text-[var(--jkuat-green-600)] transition hover:border-[var(--jkuat-green-600)]/60"
                    >
                      <input
                        type="checkbox"
                        checked={categoryFilters.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 rounded border-[var(--jkuat-green-600)] text-[var(--jkuat-green-600)] focus:ring-[var(--jkuat-green-600)]"
                      />
                      <span className="capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--jkuat-text)]/70">Location</h2>
                <div className="space-y-2">
                  {locations.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 rounded-3xl border border-[var(--jkuat-green-600)]/30 bg-[var(--jkuat-white)] px-4 py-3 text-sm text-[var(--jkuat-green-600)] transition hover:border-[var(--jkuat-green-600)]/60"
                    >
                      <input
                        type="radio"
                        name="location"
                        value={option}
                        checked={location === option}
                        onChange={() => setLocation(option)}
                        className="h-4 w-4 rounded-full border-[var(--jkuat-green-600)] text-[var(--jkuat-green-600)] focus:ring-[var(--jkuat-green-600)]"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-semibold text-[var(--jkuat-text)]/80">
                  <span>Price range</span>
                  <span>KES {minPrice.toLocaleString()} - KES {maxPrice.toLocaleString()}</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--jkuat-text)]/70">Minimum</label>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={minPrice}
                      onChange={(event) => setMinPrice(event.target.value)}
                      className="w-full accent-[var(--jkuat-green-600)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[var(--jkuat-text)]/70">Maximum</label>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      className="w-full accent-[var(--jkuat-green-600)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--jkuat-text)]/70">Results</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--jkuat-text)]">Products</h2>
                </div>
                <p className="text-sm text-[var(--jkuat-text)]/70">
                  Showing {loading ? 'latest' : products.length} result{products.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {error ? (
              <div className="rounded-[2rem] border border-[var(--jkuat-red)]/20 bg-[rgba(198,40,40,0.08)] p-6 text-sm text-[var(--jkuat-red)]">
                {error}
              </div>
            ) : null}

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-80 animate-pulse rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-muted)]"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[var(--jkuat-green-600)]/40 bg-[var(--jkuat-white)] p-12 text-center text-[var(--jkuat-text)]">
                No results found. Try adjusting your search or filters.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id || product.name} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SearchWithFilters;
