import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">Welcome to Link Saver + Auto-Summary</h1>
      <p className="mt-4 text-lg text-center">
        Save your favorite links, view summaries, and manage your bookmarks easily.
      </p>
      <div className="flex gap-4 mt-8">
        <Link href="/signup" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Sign Up</Link>
        <Link href="/login" className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">Log In</Link>
        <Link href="/add-bookmark" className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600">Add Bookmark</Link>
        <Link href="/bookmarks" className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600">View Bookmarks</Link>
      </div>
    </div>
  );
}
