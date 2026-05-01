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
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">{serviceLabel} Booking</h1>
          <p className="mt-2 text-slate-600">
            Choose a vendor and schedule your {serviceLabel.toLowerCase()} service at JKUAT.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Available Vendors</h2>
                <p className="mt-2 text-sm text-slate-600">Select a vendor near Gate A, B, or C.</p>
              </div>
            </div>

            {availableVendors.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 shadow-sm">
                <AlertCircle className="mx-auto mb-4 h-10 w-10 text-rose-500" />
                <p className="text-lg font-semibold">No vendors available</p>
                <p className="mt-2 text-sm">There are no vendors offering this service right now.</p>
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
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{vendor.name}</h3>
                        <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                            <Star className="h-4 w-4 text-amber-500" />
                            {vendor.rating}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                            <MapPin className="h-4 w-4 text-slate-500" />
                            {vendor.location}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
                        From KES {vendor.priceKES}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Booking Details</h2>
              <p className="mt-2 text-sm text-slate-600">Select a slot and submit your booking request.</p>

              {selectedVendor ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Selected Vendor</p>
                    <p className="mt-2 text-base text-slate-700">{selectedVendor.name}</p>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-700">Pick a date</p>
                    <DatePicker
                      selected={slotDate}
                      onChange={(date) => setSlotDate(date)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-700">Available time slots</p>
                    <div className="grid gap-3">
                      {loading ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-500">Loading slots…</div>
                      ) : slots.length ? (
                        slots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`w-full rounded-3xl border px-4 py-3 text-left transition ${
                              selectedSlotId === slot.id
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-slate-200 bg-white hover:border-emerald-300'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                          No available slots for this vendor.
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Pickup/Delivery Location</label>
                      <input
                        type="text"
                        value={details.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                        placeholder="e.g. Gate A hostel reception"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
                      <textarea
                        value={details.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="w-full min-h-[100px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                        placeholder="Any special instructions?"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />
                        <input
                          type="tel"
                          value={details.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-12 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                          placeholder="2547XXXXXXXX"
                        />
                      </div>
                    </div>

                    {error ? <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {loading ? 'Booking…' : 'Book Now'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
                  Select a vendor to view booking options.
                </div>
              )}
            </div>

            {confirmation ? (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                  <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{confirmation.message}</h3>
                    <p className="mt-1 text-sm text-slate-600">Your booking request has been created successfully.</p>
                  </div>
                </div>
                {confirmation.paymentRequired ? (
                  <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">Next step</p>
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
