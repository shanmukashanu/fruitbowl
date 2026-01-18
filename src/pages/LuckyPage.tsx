import React, { useState, useEffect } from 'react';
import { Award, Users, Phone, Sparkles, Heart, X, Send } from 'lucide-react';
// Using backend API for data (farmers/subscribers)

interface LuckyFarmer {
  id: string;
  name: string;
  image_url: string;
  content: string;
  phone: string | null;
}

interface LuckySubscriber {
  id: string;
  name: string;
  image_url: string;
  content: string;
  phone: string | null;
}

const LuckyPage: React.FC = () => {
  const [farmers, setFarmers] = useState<LuckyFarmer[]>([]);
  const [subscribers, setSubscribers] = useState<LuckySubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showParticipate, setShowParticipate] = useState(false);
  const [pForm, setPForm] = useState({ name: '', role: 'farmer', email: '', phone: '', message: '' });
  const [pSubmitting, setPSubmitting] = useState(false);
  const [pMsg, setPMsg] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
      const [farmersRes, subscribersRes] = await Promise.all([
        fetch(`${API_URL}/api/lucky-farmers`),
        fetch(`${API_URL}/api/lucky-subscribers`),
      ]);
      const [farmersJson, subsJson] = await Promise.all([
        farmersRes.json(), subscribersRes.json()
      ]);
      if (Array.isArray(farmersJson)) {
        setFarmers(
          farmersJson.map((f: any) => ({
            id: f._id || f.id,
            name: f.name || '',
            image_url: f.imageUrl || '',
            content: f.content || '',
            phone: f.phone || null,
          }))
        );
      }
      if (Array.isArray(subsJson)) {
        setSubscribers(
          subsJson.map((s: any) => ({
            id: s._id || s.id,
            name: s.name || '',
            image_url: s.imageUrl || '',
            content: s.content || '',
            phone: s.phone || null,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const [email, setEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/api/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'lucky' }),
      });
      if (!res.ok) throw new Error('fail');
      setMsg('Subscribed!');
      setEmail('');
    } catch {
      setMsg('Failed to subscribe');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Lucky Winners</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Lucky Stars
            </h1>
            <p className="text-xl text-orange-100 leading-relaxed max-w-2xl mx-auto">
              Celebrating our amazing farmers and loyal subscribers who make Annadata special.
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {/* Lucky Farmers */}
          <section className="py-20 bg-gradient-to-b from-white to-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Lucky Farmers
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  These hardworking farmers are the backbone of Annadata. We're proud to partner with them.
                </p>
              </div>

              {farmers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No lucky farmers featured yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {farmers.map((farmer) => (
                    <div
                      key={farmer.id}
                      className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all group"
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={farmer.image_url || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400'}
                          alt={farmer.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Farmer
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{farmer.name}</h3>
                        <p className="text-gray-600 mb-4">{farmer.content}</p>
                        {farmer.phone && (
                          <a
                            href={`tel:${farmer.phone}`}
                            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
                          >
                            <Phone className="h-4 w-4" />
                            <span>{farmer.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Lucky Subscribers */}
          <section className="py-20 bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                  <Heart className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Lucky Subscribers
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our loyal customers who won exciting prizes through our lucky draws and referral programs.
                </p>
              </div>

              {subscribers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No lucky subscribers featured yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {subscribers.map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all group"
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={subscriber.image_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'}
                          alt={subscriber.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Winner
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{subscriber.name}</h3>
                        <p className="text-gray-600 mb-4">{subscriber.content}</p>
                        {subscriber.phone && (
                          <a
                            href={`tel:${subscriber.phone}`}
                            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                          >
                            <Phone className="h-4 w-4" />
                            <span>{subscriber.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want to Be Our Next Lucky Winner?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and participate in our monthly lucky draws for a chance to win exciting prizes!
          </p>
          <form className="max-w-md mx-auto flex" onSubmit={onSubscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-l-full focus:outline-none"
            />
            <button
              type="submit"
              disabled={subLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-r-full font-semibold transition-colors disabled:opacity-50"
            >
              {subLoading ? '...' : 'Join Now'}
            </button>
            {msg && <span className="ml-3 text-white/90">{msg}</span>}
          </form>
          <div className="mt-8">
            <button
              onClick={() => { setShowParticipate(true); setPMsg(''); }}
              className="inline-flex items-center space-x-2 bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-50"
            >
              <Send className="h-4 w-4" />
              <span>Participate Now</span>
            </button>
          </div>
        </div>
      </section>

      {showParticipate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowParticipate(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Participate</h3>
              <button onClick={() => setShowParticipate(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                <input
                  type="text"
                  value={pForm.name}
                  onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participate as*</label>
                <select
                  value={pForm.role}
                  onChange={(e) => setPForm({ ...pForm, role: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="farmer">Farmer</option>
                  <option value="subscriber">Subscriber</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  value={pForm.email}
                  onChange={(e) => setPForm({ ...pForm, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={pForm.phone}
                  onChange={(e) => setPForm({ ...pForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={pForm.message}
                  onChange={(e) => setPForm({ ...pForm, message: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Why do you want to participate?"
                />
              </div>
              <button
                onClick={async () => {
                  setPSubmitting(true);
                  setPMsg('');
                  try {
                    const res = await fetch(`${API_URL}/api/participants`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(pForm),
                    });
                    if (!res.ok) throw new Error('fail');
                    setPMsg('Submitted! We will reach out soon.');
                    setPForm({ name: '', role: 'farmer', email: '', phone: '', message: '' });
                  } catch (e) {
                    setPMsg('Failed to submit. Please try again.');
                  } finally {
                    setPSubmitting(false);
                  }
                }}
                disabled={pSubmitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {pSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              {pMsg && <p className="text-sm text-gray-600">{pMsg}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyPage;
