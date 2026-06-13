import React, { useMemo, useState } from 'react';

const housesData = [
  {
    id: 1,
    name: 'Campus View Hostel',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=60',
    rentKES: 6500,
    location: 'Gate A',
    bedrooms: 1,
    amenities: ['WiFi', 'Water', 'Security'],
  },
  {
    id: 2,
    name: 'Juja Gardens House',
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9dc0b55?auto=format&fit=crop&w=900&q=60',
    rentKES: 12000,
    location: 'Juja Town',
    bedrooms: 3,
    amenities: ['Parking', 'Water', 'Kitchen'],
  },
  {
    id: 3,
    name: 'Gate B Studios',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=60',
    rentKES: 8000,
    location: 'Gate B',
    bedrooms: 2,
    amenities: ['WiFi', 'Laundry', 'Security'],
  },
  {
    id: 4,
    name: 'Sunrise Cottages',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=60',
    rentKES: 9500,
    location: 'Gate C',
    bedrooms: 2,
    amenities: ['Water', 'Parking', 'Garden'],
  },
];

const locations = ['All', 'Gate A', 'Gate B', 'Gate C', 'Juja Town'];
const bedroomsOptions = ['All', '1', '2', '3+'];

const Househunting = () => {
  const [priceRange, setPriceRange] = useState(15000);
  const [locationFilter, setLocationFilter] = useState('All');
  const [bedroomFilter, setBedroomFilter] = useState('All');
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingDate, setViewingDate] = useState('');
  const [viewingTime, setViewingTime] = useState('16:00');

  const filteredHouses = useMemo(() => {
    return housesData.filter((house) => {
      const matchesPrice = house.rentKES <= priceRange;
      const matchesLocation = locationFilter === 'All' || house.location === locationFilter;
      const matchesBedrooms =
        bedroomFilter === 'All' ||
        (bedroomFilter === '3+' ? house.bedrooms >= 3 : house.bedrooms === Number(bedroomFilter));

      return matchesPrice && matchesLocation && matchesBedrooms;
    });
  }, [priceRange, locationFilter, bedroomFilter]);

  const openModal = (house) => {
    setSelectedHouse(house);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedHouse(null);
  };

  const handleBooking = (event) => {
    event.preventDefault();
    closeModal();
    // later: submit booking to /api/houses or booking endpoint
  };

  return (
    <div className="min-h-screen bg-[var(--jkuat-muted)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
          <h1 className="text-3xl font-semibold text-[var(--jkuat-text)]">House Hunting</h1>
          <p className="mt-2 text-[var(--jkuat-text)]/75">Browse hostel and house listings for JKUAT students.</p>
        </header>

        <section className="mb-8 grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
            <h2 className="text-xl font-semibold text-[var(--jkuat-text)]">Filters</h2>

            <div className="mt-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Max Rent (KES)</label>
                <input
                  type="range"
                  min="3000"
                  max="15000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[var(--jkuat-green-600)]"
                />
                <div className="mt-2 text-sm text-[var(--jkuat-text)]/70">Up to KES {priceRange}</div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Bedrooms</label>
                <select
                  value={bedroomFilter}
                  onChange={(e) => setBedroomFilter(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                >
                  {bedroomsOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <main>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
              <div>
                <p className="text-sm text-[var(--jkuat-text)]/70">Showing {filteredHouses.length} listings</p>
                <h2 className="text-2xl font-semibold text-[var(--jkuat-text)]">Available homes</h2>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredHouses.map((house) => (
                <article key={house.id} className="overflow-hidden rounded-3xl bg-[var(--jkuat-white)] border border-[var(--jkuat-green-600)]/10 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <img src={house.image} alt={house.name} className="h-56 w-full object-cover" />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-[var(--jkuat-text)]">{house.name}</h3>
                      <span className="rounded-full bg-[rgba(14,122,54,0.12)] px-3 py-1 text-sm font-semibold text-[var(--jkuat-green-600)]">
                        KES {house.rentKES}/mo
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[var(--jkuat-text)]/75">{house.location}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-[var(--jkuat-text)]/80">
                      <span className="rounded-full bg-[var(--jkuat-muted)] px-3 py-1">{house.bedrooms} bed</span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-[var(--jkuat-text)]/75">
                      {house.amenities.map((amenity) => {
                        return (
                          <span key={amenity} className="inline-flex items-center gap-2 rounded-full bg-[rgba(14,122,54,0.08)] px-3 py-2 text-[var(--jkuat-text)]/80">
                            <span className="h-2.5 w-2.5 rounded-full bg-[var(--jkuat-green-600)]" />
                            {amenity}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => openModal(house)}
                      className="mt-6 w-full rounded-2xl bg-[var(--jkuat-green-600)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0d7031]"
                    >
                      Book Viewing
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </section>
      </div>

      {modalOpen && selectedHouse ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,36,0.65)] px-4 py-8">
          <div className="w-full max-w-2xl rounded-[32px] bg-[var(--jkuat-white)] border border-[var(--jkuat-green-600)]/10 p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--jkuat-text)]">Book Viewing</h2>
                <p className="mt-2 text-sm text-[var(--jkuat-text)]/75">{selectedHouse.name} - {selectedHouse.location}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full bg-[var(--jkuat-muted)] p-3 text-[var(--jkuat-text)]/80 transition hover:bg-[var(--jkuat-white)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBooking} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Preferred date</label>
                <input
                  type="date"
                  value={viewingDate}
                  onChange={(e) => setViewingDate(e.target.value)}
                  className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Preferred time</label>
                <input
                  type="time"
                  value={viewingTime}
                  onChange={(e) => setViewingTime(e.target.value)}
                  className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-[var(--jkuat-green-600)]/30 px-5 py-3 text-sm font-semibold text-[var(--jkuat-green-600)] transition hover:bg-[rgba(14,122,54,0.08)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[var(--jkuat-green-600)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d7031]"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Househunting;
