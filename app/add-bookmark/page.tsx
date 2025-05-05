"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function AddBookmark() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
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

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      // Fetch metadata (title and favicon)
      const response = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(url)}`);
      const metadata = await response.json();

      if (!response.ok) {
        throw new Error(metadata.error || 'Failed to fetch metadata');
      }

      // Save to Supabase
      const { error } = await supabase.from('bookmarks').insert({
        url,
        title: metadata.title,
        favicon: metadata.favicon,
        summary: metadata.summary,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage('Bookmark added successfully!');
      setUrl('');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Add Bookmark</h1>
      <form onSubmit={handleAddBookmark} className="flex flex-col gap-4 mt-4">
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add Bookmark
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}