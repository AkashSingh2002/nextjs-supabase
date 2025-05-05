"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

interface Bookmark {
  id: number;
  url: string;
  title: string;
  favicon: string;
  summary: string;
}

function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data, error } = await supabase.from('bookmarks').select('*');
      if (error) {
        setError('Failed to fetch bookmarks');
      } else {
        setBookmarks(data || []);
      }
    };

    fetchBookmarks();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (error) {
      setError('Failed to delete bookmark');
    } else {
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Your Bookmarks</h1>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="p-4 border border-gray-300 rounded">
            <img src={bookmark.favicon} alt="Favicon" className="w-8 h-8" />
            <h2 className="mt-2 text-lg font-bold">{bookmark.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{bookmark.summary}</p>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-500 underline"
            >
              Visit Link
            </a>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="mt-2 text-red-500 underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookmarkList;