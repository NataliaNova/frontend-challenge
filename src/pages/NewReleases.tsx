import { useEffect, useState, useRef, useCallback } from "react";
import { getNewReleases, getNextReleases } from "../api/spotifyApi";
import { motion } from "framer-motion";
import { useLogout } from "../auth/useLogout"; 

type Album = {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
};

type Props = {
  token: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function NewReleases({ token }: Props) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const logout = useLogout();

  const loaderRef = useRef<HTMLDivElement>(null);

  const loadReleases = useCallback(async (url?: string) => {
    try {
  setIsLoading(true);
  const data = url ? await getNextReleases(token, url) : await getNewReleases(token);
  setAlbums(prev => (url ? [...prev, ...data.albums.items] : data.albums.items));
  setNextUrl(data.albums.next);
  setError(null);
} catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Error loading albums");
  }
} finally {
  setIsLoading(false);
}
console.log("Token recibido en NewReleases:", token);
  }, [token]);

  useEffect(() => {
    loadReleases();
  }, [loadReleases]);

  useEffect(() => {
    if (!loaderRef.current || !nextUrl || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadReleases(nextUrl);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [nextUrl, isLoading, loadReleases]);

  if (error) return (
    <div className="text-center my-6">
      <p className="text-red-600 mb-2">Error: {error}</p>
      <button
        onClick={() => loadReleases(nextUrl || undefined)}
        className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-400"
      >
        Reintentar
      </button>
    </div>
  );

  return (
  <>
<header className="
  sticky top-0 z-50 bg-gray-900 text-white 
  flex flex-col sm:flex-row justify-between items-center px-6 py-4 shadow-md
">
  <h1 className="text-2xl font-bold tracking-wide">New Releases This Week</h1>
<div className="flex justify-center w-full sm:w-auto mt-4 sm:mt-0">
    <motion.button
      onClick={logout}
      className="
        flex items-center justify-center
        text-white border border-white rounded 
        px-3 py-1 text-sm font-semibold
        transition-all duration-150
        sm:px-4 sm:py-2 sm:text-base 
        md:px-5 md:py-2 md:text-lg
        mx-auto
      "
      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <span className="block sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
      <span className="hidden sm:block">Cerrar sesión</span>
    </motion.button>
  </div>
</header>


    <motion.div
      className="p-6 bg-black text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {albums.map((album) => (
        <motion.div
          key={album.id}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          variants={itemVariants}
          layout
        >
          <img
            src={album.images[0]?.url}
            alt={album.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="font-bold text-lg">{album.name}</h2>
            <p className="text-gray-400 text-sm">
              {album.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>

    {isLoading && (
      <div className="flex justify-center my-6">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )}

    <div ref={loaderRef} style={{ height: 1 }}></div>
  </>
);

}
