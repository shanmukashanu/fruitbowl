import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, BookOpen, Play } from 'lucide-react';
// Use backend API for blogs

interface Blog {
  id: string;
  title: string;
  content: string;
  image_url: string;
  video_url: string | null;
  created_at: string;
}

const InsightsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/blogs`);
      const json = await res.json();
      if (Array.isArray(json)) {
        const mapped = json.map((b: any) => {
          const isVideo = (b.mediaType || '').toLowerCase() === 'video';
          return {
            id: b._id || b.id,
            title: b.title || '',
            content: b.content || '',
            image_url: isVideo ? '' : (b.mediaUrl || ''),
            video_url: isVideo ? (b.mediaUrl || '') : null,
            created_at: b.createdAt || new Date().toISOString(),
          } as Blog;
        });
        setBlogs(mapped);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const readTime = (content: string) => {
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              <span>Knowledge Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Insights & Blogs</h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Discover tips, stories, and knowledge about fruits, farming, and healthy living.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading insights...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No blogs available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
                  onClick={() => setSelectedBlog(blog)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={blog.image_url || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {blog.video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="bg-white/90 p-4 rounded-full">
                          <Play className="h-8 w-8 text-green-600 fill-current" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(blog.created_at)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{readTime(blog.content)} min read</span>
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {blog.content}
                    </p>
                    <span className="inline-flex items-center space-x-2 text-green-600 font-semibold group-hover:text-green-700">
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedBlog(null)}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {selectedBlog.video_url ? (
              <div className="aspect-video">
                <iframe
                  src={selectedBlog.video_url}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img
                src={selectedBlog.image_url || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800'}
                alt={selectedBlog.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedBlog.created_at)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{readTime(selectedBlog.content)} min read</span>
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedBlog.title}</h1>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {selectedBlog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest insights, tips, and exclusive offers.
          </p>
          <NewsletterInsightsForm />
        </div>
      </section>
    </div>
  );
};

const NewsletterInsightsForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/api/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'insights' }),
      });
      if (!res.ok) throw new Error('fail');
      setMsg('Subscribed!');
      setEmail('');
    } catch {
      setMsg('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-md mx-auto flex" onSubmit={onSubmit}>
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
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-r-full font-semibold transition-colors disabled:opacity-50"
      >
        {loading ? '...' : 'Subscribe'}
      </button>
      {msg && <span className="ml-3 text-white/90">{msg}</span>}
    </form>
  );
};

export default InsightsPage;
