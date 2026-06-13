import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { MapPin, Star, AlertCircle, Phone, MessageCircle } from 'lucide-react';

const vendorsData = [
  {
    id: 'v1',
    name: 'Jomo Laundry',
    rating: 4.8,
    priceKES: 350,
    location: 'Gate A',
    services: ['laundry'],
  },
  {
    id: 'v2',
    name: 'Campus Salon',
    rating: 4.6,
    priceKES: 650,
    location: 'Gate B',
    services: ['salon'],
  },
  {
    id: 'v3',
    name: 'Health Point Clinic',
    rating: 4.7,
    priceKES: 1200,
    location: 'Gate C',
    services: ['treatment'],
  },
];

const ServiceBooking = () => {
  const { type } = useParams();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [slotDate, setSlotDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [details, setDetails] = useState({
    location: '',
    notes: '',
    phone: '',
  });
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const serviceLabel = useMemo(() => {
    if (type === 'laundry') return 'Laundry';
    if (type === 'salon') return 'Salon';
    if (type === 'treatment') return 'Medical Treatment';
    return 'Service';
  }, [type]);

  const availableVendors = useMemo(
    () => vendorsData.filter((vendor) => vendor.services.includes(type)),
    [type]
  );

  useEffect(() => {
    if (!selectedVendor) {
      setSlots([]);
      setSelectedSlotId(null);
      return;
    }

    const fetchSlots = async () => {
      setLoading(true);
      try {
        // later: GET /api/vendors/:id/slots
        const dummySlots = [
          { id: 's1', time: '10:00 AM' },
          { id: 's2', time: '12:00 PM' },
          { id: 's3', time: '03:00 PM' },
        ];
        setSlots(dummySlots);
      } catch (err) {
        setError('Unable to load available slots.');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedVendor]);

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setConfirmation(null);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleBooking = async (event) => {
    event.preventDefault();
    if (!selectedVendor || !selectedSlotId || !details.location || !details.phone) {
      setError('Please select a vendor, slot, location, and phone number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // later: POST /api/bookings with vendorId, slotId, details
      const booking = {
        id: `b-${Date.now()}`,
        vendor: selectedVendor.name,
        service: serviceLabel,
        slot: slots.find((slot) => slot.id === selectedSlotId)?.time,
        location: details.location,
        phone: details.phone,
      };
      setConfirmation({
        message: `Booking confirmed with ${selectedVendor.name}.`,
        paymentRequired: true,
        booking,
      });
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--jkuat-muted)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
          <h1 className="text-3xl font-semibold text-[var(--jkuat-text)]">{serviceLabel} Booking</h1>
          <p className="mt-2 text-[var(--jkuat-text)]/80">
            Choose a vendor and schedule your {serviceLabel.toLowerCase()} service at JKUAT.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
              <div>
                <h2 className="text-xl font-semibold text-[var(--jkuat-text)]">Available Vendors</h2>
                <p className="mt-2 text-sm text-[var(--jkuat-text)]/80">Select a vendor near Gate A, B, or C.</p>
              </div>
            </div>

            {availableVendors.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--jkuat-green-600)]/30 bg-[var(--jkuat-white)] p-8 text-center text-[var(--jkuat-text)]/80 shadow-sm">
                <AlertCircle className="mx-auto mb-4 h-10 w-10 text-[var(--jkuat-red)]" />
                <p className="text-lg font-semibold text-[var(--jkuat-text)]">No vendors available</p>
                <p className="mt-2 text-sm text-[var(--jkuat-text)]/75">There are no vendors offering this service right now.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {availableVendors.map((vendor) => (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => handleVendorClick(vendor)}
                    className={`rounded-3xl border p-5 text-left shadow-sm transition ${
                      selectedVendor?.id === vendor.id
                        ? 'border-[var(--jkuat-green-600)] bg-[rgba(14,122,54,0.12)]'
                        : 'border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] hover:border-[var(--jkuat-green-600)]/40 hover:bg-[var(--jkuat-muted)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--jkuat-text)]">{vendor.name}</h3>
                        <div className="mt-2 flex items-center gap-3 text-sm text-[var(--jkuat-text)]/75">
                          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--jkuat-muted)] px-3 py-1">
                            <Star className="h-4 w-4 text-amber-500" />
                            {vendor.rating}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--jkuat-muted)] px-3 py-1 text-[var(--jkuat-text)]/75">
                            <MapPin className="h-4 w-4 text-[var(--jkuat-text)]/60" />
                            {vendor.location}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-3xl bg-[var(--jkuat-muted)] px-4 py-2 text-sm font-semibold text-[var(--jkuat-text)]">
                        From KES {vendor.priceKES}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
              <h2 className="text-xl font-semibold text-[var(--jkuat-text)]">Booking Details</h2>
              <p className="mt-2 text-sm text-[var(--jkuat-text)]/80">Select a slot and submit your booking request.</p>

              {selectedVendor ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] p-4">
                    <p className="text-sm font-semibold text-[var(--jkuat-text)]">Selected Vendor</p>
                    <p className="mt-2 text-base text-[var(--jkuat-text)]/80">{selectedVendor.name}</p>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-[var(--jkuat-text)]/75">Pick a date</p>
                    <DatePicker
                      selected={slotDate}
                      onChange={(date) => setSlotDate(date)}
                      className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-[var(--jkuat-text)]/75">Available time slots</p>
                    <div className="grid gap-3">
                      {loading ? (
                        <div className="rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-muted)] p-4 text-center text-[var(--jkuat-text)]/70">Loading slots…</div>
                      ) : slots.length ? (
                        slots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`w-full rounded-3xl border px-4 py-3 text-left transition ${
                              selectedSlotId === slot.id
                                ? 'border-[var(--jkuat-green-600)] bg-[rgba(14,122,54,0.12)]'
                                : 'border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] hover:border-[var(--jkuat-green-600)]/40'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-dashed border-[var(--jkuat-green-600)]/40 bg-[var(--jkuat-muted)] p-4 text-sm text-[var(--jkuat-text)]/70">
                          No available slots for this vendor.
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/75">Pickup/Delivery Location</label>
                      <input
                        type="text"
                        value={details.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                        placeholder="e.g. Gate A hostel reception"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/75">Notes</label>
                      <textarea
                        value={details.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="w-full min-h-[100px] rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                        placeholder="Any special instructions?"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/75">Phone</label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-[var(--jkuat-text)]/50" />
                        <input
                          type="tel"
                          value={details.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-12 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                          placeholder="2547XXXXXXXX"
                        />
                      </div>
                    </div>

                    {error ? <div className="rounded-3xl bg-[rgba(198,40,40,0.08)] px-4 py-3 text-sm text-[var(--jkuat-red)]">{error}</div> : null}

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center rounded-3xl bg-[var(--jkuat-green-600)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d7031] disabled:cursor-not-allowed disabled:bg-[rgba(14,122,54,0.4)]"
                    >
                      {loading ? 'Booking…' : 'Book Now'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-muted)] p-6 text-[var(--jkuat-text)]/80">
                  Select a vendor to view booking options.
                </div>
              )}
            </div>

            {confirmation ? (
              <div className="rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
                <div className="flex items-center gap-3 rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[rgba(14,122,54,0.08)] p-5">
                  <div className="rounded-2xl bg-[var(--jkuat-green-600)] p-3 text-white">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--jkuat-text)]">{confirmation.message}</h3>
                    <p className="mt-1 text-sm text-[var(--jkuat-text)]/80">Your booking request has been created successfully.</p>
                  </div>
                </div>
                {confirmation.paymentRequired ? (
                  <div className="mt-5 rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] p-5 text-sm text-[var(--jkuat-text)]/80">
                    <p className="font-semibold text-[var(--jkuat-text)]">Next step</p>
                    <p className="mt-2">Please complete payment via M-Pesa to confirm this booking.</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceBooking;
