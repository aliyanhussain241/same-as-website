import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const Blog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [active, setActive] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // auth/admin
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // admin form
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  // login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [authMsg, setAuthMsg] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });
    setPosts((data as Post[]) || []);
    setLoading(false);
  };

  const loadAllPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setAllPosts((data as Post[]) || []);
  };

  useEffect(() => {
    loadPosts();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  // URL se active post sync karo
  useEffect(() => {
    const path = location.pathname;
    const slugFromUrl = path.startsWith('/blog/') ? path.replace('/blog/', '') : null;
    if (slugFromUrl && posts.length > 0) {
      const found = posts.find(p => p.slug === slugFromUrl);
      if (found) setActive(found);
    }
    if (path === '/blog') setActive(null);
  }, [location.pathname, posts]);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin')
      .then(({ data }) => setIsAdmin(!!data?.length));
  }, [user]);

  useEffect(() => {
    if (showAdmin && isAdmin) loadAllPosts();
  }, [showAdmin, isAdmin]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMsg(null);
    if (authMode === 'sign_up') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/` }
      });
      setAuthMsg(error ? error.message : 'Account created. Check your email to confirm, then sign in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthMsg(error.message);
    }
  };

  const handleSave = async () => {
    if (!editing?.title || !editing?.content) return;
    const slug = editing.slug || slugify(editing.title);
    const payload = {
      title: editing.title,
      slug,
      excerpt: editing.excerpt || null,
      content: editing.content,
      cover_image_url: editing.cover_image_url || null,
      published: !!editing.published,
      published_at: editing.published ? (editing.published_at || new Date().toISOString()) : null,
      author_id: user?.id,
    };
    if (editing.id) {
      await supabase.from('blog_posts').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('blog_posts').insert(payload);
    }
    setEditing(null);
    loadAllPosts();
    loadPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    loadAllPosts();
    loadPosts();
  };

  // ---------- VIEWS ----------
  if (active) {
    return (
      <div className="min-h-screen pt-[100px] pb-20 px-6 max-w-3xl mx-auto">
        <button
          onClick={() => { setActive(null); navigate({ to: '/blog' }); }}
          className="text-[#EA580C] mb-6 text-sm font-medium"
        >
          ← Back to blog
        </button>
        {active.cover_image_url && (
          <img src={active.cover_image_url} alt={active.title} className="w-full h-64 object-cover rounded-xl mb-6" />
        )}
        <h1 className="text-4xl font-bold mb-3 text-[#111827]">{active.title}</h1>
        {active.published_at && (
          <p className="text-sm text-[#6b7280] mb-8">{new Date(active.published_at).toLocaleDateString()}</p>
        )}
        <div className="prose prose-lg max-w-none whitespace-pre-wrap text-[#374151] leading-relaxed">
          {active.content}
        </div>
        <div className="mt-12 p-6 bg-orange-50 rounded-2xl text-center">
          <p className="text-lg font-bold text-[#111827] mb-2">Ready to build your resume?</p>
          <a
            href="/resume"
            className="inline-block bg-[#EA580C] text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            Build your free AI resume →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[100px] pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Career Insights Blog</h1>
            <p className="text-lg text-[#6b7280]">Expert tips on resumes, interviews, and careers.</p>
          </div>
          <button
            onClick={() => setShowAdmin((v) => !v)}
            className="text-sm text-[#6b7280] hover:text-[#EA580C] underline"
          >
            {showAdmin ? 'Hide admin' : 'Admin'}
          </button>
        </div>

        {/* ADMIN PANEL */}
        {showAdmin && (
          <div className="mb-12 border-2 border-dashed border-[#FED7AA] rounded-2xl p-6 bg-orange-50/30">
            {!user ? (
              <form onSubmit={handleAuth} className="max-w-sm">
                <h3 className="font-bold mb-4 text-lg">{authMode === 'sign_in' ? 'Admin Sign In' : 'Create Account'}</h3>
                <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-3" />
                <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-3" />
                <button type="submit" className="w-full bg-[#EA580C] text-white py-2 rounded-lg font-semibold">
                  {authMode === 'sign_in' ? 'Sign In' : 'Sign Up'}
                </button>
                <button type="button" onClick={() => setAuthMode(authMode === 'sign_in' ? 'sign_up' : 'sign_in')}
                  className="w-full text-sm text-[#6b7280] mt-3">
                  {authMode === 'sign_in' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
                </button>
                {authMsg && <p className="mt-3 text-sm text-[#374151]">{authMsg}</p>}
              </form>
            ) : !isAdmin ? (
              <div>
                <p className="text-sm text-[#374151] mb-3">
                  You're signed in as <strong>{user.email}</strong> but don't have admin access.
                </p>
                <p className="text-xs text-[#6b7280] mb-3">
                  Ask your project owner to grant you the <code>admin</code> role in the <code>user_roles</code> table (your user id: <code>{user.id}</code>).
                </p>
                <button onClick={() => supabase.auth.signOut()} className="text-sm underline">Sign out</button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Manage Posts</h3>
                  <div className="flex gap-3">
                    <button onClick={() => setEditing({ title: '', content: '', published: false })}
                      className="bg-[#EA580C] text-white px-4 py-2 rounded-lg text-sm font-semibold">+ New Post</button>
                    <button onClick={() => supabase.auth.signOut()} className="text-sm underline">Sign out</button>
                  </div>
                </div>
                {editing && (
                  <div className="bg-white p-5 rounded-xl border mb-5 space-y-3">
                    <input placeholder="Title" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-lg font-semibold" />
                    <input placeholder="slug-url-friendly" value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm" />
                    <input placeholder="Cover image URL (optional)" value={editing.cover_image_url || ''}
                      onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm" />
                    <textarea placeholder="Excerpt" value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm" rows={2} />
                    <textarea placeholder="Content (markdown or plain text)" value={editing.content || ''}
                      onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-sm font-mono" rows={12} />
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={!!editing.published}
                        onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                      Published
                    </label>
                    <div className="flex gap-3">
                      <button onClick={handleSave} className="bg-[#EA580C] text-white px-4 py-2 rounded-lg font-semibold">Save</button>
                      <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border">Cancel</button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {allPosts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <div className="font-semibold">{p.title}</div>
                        <div className="text-xs text-[#6b7280]">
                          {p.published ? '✓ Published' : '○ Draft'} · /{p.slug}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(p)} className="text-sm text-[#EA580C]">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                  {allPosts.length === 0 && <p className="text-sm text-[#6b7280]">No posts yet.</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PUBLIC POST LIST */}
        {loading ? (
          <p className="text-center text-[#6b7280]">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-[#6b7280]">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article
                key={p.id}
                onClick={() => { setActive(p); navigate({ to: '/blog/' + p.slug }); }}
                className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#0a0a0a]/10 hover:shadow-lg transition-shadow"
              >
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt={p.title} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-orange-100 to-orange-200" />
                )}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-[#111827] line-clamp-2">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-[#6b7280] line-clamp-3">{p.excerpt}</p>}
                  {p.published_at && (
                    <p className="text-xs text-[#9ca3af] mt-3">{new Date(p.published_at).toLocaleDateString()}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
