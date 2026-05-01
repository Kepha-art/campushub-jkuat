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
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">House Hunting</h1>
          <p className="mt-2 text-slate-600">Browse hostel and house listings for JKUAT students.</p>
        </header>

        <section className="mb-8 grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Filters</h2>

            <div className="mt-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Max Rent (KES)</label>
                <input
                  type="range"
                  min="3000"
                  max="15000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="mt-2 text-sm text-slate-600">Up to KES {priceRange}</div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Bedrooms</label>
                <select
                  value={bedroomFilter}
                  onChange={(e) => setBedroomFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none"
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
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm text-slate-500">Showing {filteredHouses.length} listings</p>
                <h2 className="text-2xl font-semibold text-slate-900">Available homes</h2>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredHouses.map((house) => (
                <article key={house.id} className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <img src={house.image} alt={house.name} className="h-56 w-full object-cover" />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-slate-900">{house.name}</h3>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        KES {house.rentKES}/mo
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{house.location}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                      <span className="rounded-full bg-slate-100 px-3 py-1">{house.bedrooms} bed</span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600">
                      {house.amenities.map((amenity) => (
                        <span key={amenity} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => openModal(house)}
                      className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Book Viewing</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedHouse.name} - {selectedHouse.location}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full bg-slate-100 p-3 text-slate-600 transition hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBooking} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Preferred date</label>
                <input
                  type="date"
                  value={viewingDate}
                  onChange={(e) => setViewingDate(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Preferred time</label>
                <input
                  type="time"
                  value={viewingTime}
                  onChange={(e) => setViewingTime(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
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
