import React, { useEffect, useMemo, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useForm } from 'react-hook-form';

const categories = ['clothes', 'food', 'utensils', 'furniture', 'supermarket'];
const statusOptions = ['Pending', 'Processing', 'Delivered'];

const dummyProducts = [
  {
    id: 'p1',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=60',
    name: 'Campus Bedding Set',
    priceKES: 2450,
    stock: 14,
  },
  {
    id: 'p2',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=60',
    name: 'Laundry Service Bundle',
    priceKES: 900,
    stock: 30,
  },
];

const dummyOrders = [
  {
    id: 'o1',
    customerName: 'Wanjiru C.',
    items: '2x Bedding, 1x Soap',
    totalKES: 3350,
    status: 'Pending',
  },
  {
    id: 'o2',
    customerName: 'David K.',
    items: '1x Meal pack',
    totalKES: 680,
    status: 'Processing',
  },
];

const VendorDashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isServiceVendor] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchVendorData = async () => {
      setIsLoading(true);
      try {
        // Later: fetch from GET /api/vendor/products and GET /api/orders
        setProducts(dummyProducts);
        setOrders(dummyOrders);
      } catch (error) {
        setToast({ type: 'error', message: 'Failed to load vendor data.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const handleAddProduct = async (data) => {
    try {
      setIsLoading(true);
      // later: POST /api/products and upload images to Cloudinary
      const newProduct = {
        id: `p-${Date.now()}`,
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=60',
        name: data.name,
        priceKES: Number(data.price),
        stock: Number(data.stock),
      };
      setProducts((current) => [newProduct, ...current]);
      reset();
      setToast({ type: 'success', message: 'Product added successfully.' });
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to add product.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      // later: PATCH /api/orders/:id
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
      setToast({ type: 'success', message: 'Order status updated.' });
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to update order status.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlot = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const date = formData.get('slotDate');
    const time = formData.get('slotTime');
    if (!date || !time) {
      setToast({ type: 'error', message: 'Please select date and time.' });
      return;
    }

    try {
      setIsLoading(true);
      // later: POST /api/slots
      setSlots((current) => [...current, { id: `s-${Date.now()}`, date, time }]);
      event.target.reset();
      setToast({ type: 'success', message: 'Time slot added.' });
    } catch (error) {
      setToast({ type: 'error', message: 'Could not add time slot.' });
    } finally {
      setIsLoading(false);
    }
  };

  const productTable = useMemo(
    () => (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-[var(--jkuat-green-600)]/10 bg-[var(--jkuat-white)] shadow-sm">
          <table className="min-w-full divide-y divide-[var(--jkuat-green-600)]/10 text-left text-sm">
            <thead className="bg-[var(--jkuat-muted)]">
              <tr>
                <th className="px-4 py-4 font-medium text-[var(--jkuat-text)]/80">Item</th>
                <th className="px-4 py-4 font-medium text-[var(--jkuat-text)]/80">Price</th>
                <th className="px-4 py-4 font-medium text-[var(--jkuat-text)]/80">Stock</th>
                <th className="px-4 py-4 font-medium text-[var(--jkuat-text)]/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--jkuat-green-600)]/10 bg-[var(--jkuat-white)]">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                    <div>
                      <div className="font-semibold text-[var(--jkuat-text)]">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[var(--jkuat-text)]/80">KES {product.priceKES}</td>
                  <td className="px-4 py-4 text-[var(--jkuat-text)]/80">{product.stock}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product.id)}
                      className="rounded-2xl border border-[var(--jkuat-green-600)]/20 px-3 py-2 text-sm font-semibold text-[var(--jkuat-text)]/80 transition hover:bg-[var(--jkuat-muted)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setProducts((current) => current.filter((item) => item.id !== product.id))}
                      className="rounded-2xl bg-[var(--jkuat-red)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#9e2323]"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
    [products]
  );

  const ordersTable = useMemo(
    () => (
      <div className="overflow-hidden rounded-3xl border border-[var(--jkuat-green-600)]/10 bg-[var(--jkuat-white)] shadow-sm">
        <table className="min-w-full divide-y divide-[var(--jkuat-green-600)]/10 text-left text-sm">
          <thead className="bg-[var(--jkuat-muted)]">
            <tr>
              <th className="px-4 py-4 font-medium text-[var(--jkuat-text)]/80">Customer</th>
              <th className="px-4 py-4 font-medium text-[var(--jkuat-text)]/80">Items</th>
              <th className="px-4 py-4 font-medium text-[var(--jkuat-text)]/80">Total</th>
              <th className="px-4 py-4 font-medium text-[var(--jkuat-text)]/80">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--jkuat-green-600)]/10 bg-[var(--jkuat-white)]">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-4 text-[var(--jkuat-text)]">{order.customerName}</td>
                <td className="px-4 py-4 text-[var(--jkuat-text)]/80">{order.items}</td>
                <td className="px-4 py-4 text-[var(--jkuat-text)]/80">KES {order.totalKES}</td>
                <td className="px-4 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                    className="w-full rounded-2xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-3 py-2 text-sm text-[var(--jkuat-text)] focus:border-[var(--jkuat-green-600)] focus:outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    [orders]
  );

  return (
    <div className="min-h-screen bg-[var(--jkuat-muted)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--jkuat-text)]">Vendor Dashboard</h1>
              <p className="mt-2 text-[var(--jkuat-text)]/80">Manage marketplace products, orders, and service availability.</p>
            </div>
            <div className="rounded-3xl bg-[var(--jkuat-muted)] px-4 py-3 text-[var(--jkuat-text)]/80 shadow-sm">
              {isLoading ? 'Loading vendor tools…' : 'Ready to manage your business'}
            </div>
          </div>
        </div>

        <Tab.Group selectedIndex={activeIndex} onChange={setActiveIndex}>
          <Tab.List className="grid gap-2 sm:grid-cols-4">
            {['My Products', 'Add Product', 'Orders', 'Service Time Slots'].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                    selected ? 'border-[var(--jkuat-green-600)] bg-[var(--jkuat-green-600)] text-white' : 'border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] text-[var(--jkuat-text)]/80'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
              {productTable}
            </Tab.Panel>
            <Tab.Panel>
              <div className="rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
                <form onSubmit={handleSubmit(handleAddProduct)} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Product Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="mt-2 text-sm text-[var(--jkuat-red)]">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Description</label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      className="min-h-[120px] w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                      placeholder="What are you selling?"
                    />
                    {errors.description && <p className="mt-2 text-sm text-[var(--jkuat-red)]">{errors.description.message}</p>}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Price (KES)</label>
                      <input
                        type="number"
                        {...register('price', { required: 'Price is required', min: 1 })}
                        className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                        placeholder="KES"
                      />
                      {errors.price && <p className="mt-2 text-sm text-[var(--jkuat-red)]">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Category</label>
                      <select
                        {...register('category', { required: 'Category is required' })}
                        className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category && <p className="mt-2 text-sm text-[var(--jkuat-red)]">{errors.category.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Stock</label>
                      <input
                        type="number"
                        {...register('stock', { required: 'Stock is required', min: 0 })}
                        className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                        placeholder="Quantity available"
                      />
                      {errors.stock && <p className="mt-2 text-sm text-[var(--jkuat-red)]">{errors.stock.message}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Images</label>
                      <input
                        type="file"
                        multiple
                        {...register('images')}
                        className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                      />
                      <p className="mt-2 text-sm text-[var(--jkuat-text)]/70">Upload photos to Cloudinary later.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="inline-flex items-center justify-center rounded-3xl bg-[var(--jkuat-green-600)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d7031] disabled:cursor-not-allowed disabled:bg-[rgba(14,122,54,0.4)]"
                    >
                      {isSubmitting || isLoading ? 'Saving…' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              {ordersTable}
            </Tab.Panel>
            <Tab.Panel>
              {isServiceVendor ? (
                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
                    <h2 className="text-xl font-semibold text-[var(--jkuat-text)]">Add Service Time Slot</h2>
                    <form onSubmit={handleAddSlot} className="mt-6 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Date</label>
                        <input
                          type="date"
                          name="slotDate"
                          className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--jkuat-text)]/80">Time</label>
                        <input
                          type="time"
                          name="slotTime"
                          className="w-full rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-white)] px-4 py-3 text-[var(--jkuat-text)] shadow-sm focus:border-[var(--jkuat-green-600)] focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="rounded-3xl bg-[var(--jkuat-green-600)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d7031]"
                        >
                          Add Slot
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
                    <h2 className="text-xl font-semibold text-[var(--jkuat-text)]">Available Slots</h2>
                    <div className="mt-4 space-y-3">
                      {slots.length ? (
                        slots.map((slot) => (
                          <div key={slot.id} className="rounded-3xl border border-[var(--jkuat-green-600)]/20 bg-[var(--jkuat-muted)] px-4 py-3">
                            <div className="font-semibold text-[var(--jkuat-text)]">{slot.date}</div>
                            <div className="text-sm text-[var(--jkuat-text)]/70">{slot.time}</div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-dashed border-[var(--jkuat-green-600)]/30 bg-[var(--jkuat-muted)] px-4 py-6 text-sm text-[var(--jkuat-text)]/70">
                          No slots added yet. Add a time slot for laundry or salon bookings.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-[var(--jkuat-white)] p-6 shadow-sm border border-[var(--jkuat-green-600)]/10">
                  <p className="text-[var(--jkuat-text)]/75">Service time slots are available only for vendors offering services.</p>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {toast ? (
        <div className={`fixed bottom-6 right-6 z-50 rounded-3xl px-5 py-4 text-sm font-semibold shadow-lg ${
          toast.type === 'success' ? 'bg-[var(--jkuat-green-600)] text-white' : 'bg-[var(--jkuat-red)] text-white'
        }`}>
          {toast.message}
        </div>
      ) : null}
    </div>
  );
};

export default VendorDashboard;
