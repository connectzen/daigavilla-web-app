import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  uploadDate: string;
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all videos from Firestore
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'videos'));
      const videosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
      // Sort by uploadDate descending (newest first)
      const sortedVideos = videosData.sort((a, b) => {
        const dateA = new Date(a.uploadDate).getTime();
        const dateB = new Date(b.uploadDate).getTime();
        return dateB - dateA; // Descending order
      });
      setVideos(sortedVideos);
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new video
  const addVideo = useCallback(async (videoData: Omit<Video, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'videos'), {
        ...videoData,
        uploadDate: new Date().toISOString(),
      });

      await fetchVideos();
      return docRef.id;
    } catch (err) {
      console.error('Error adding video:', err);
      throw new Error('Failed to add video');
    }
  }, [fetchVideos]);

  // Update an existing video
  const updateVideo = useCallback(async (id: string, videoData: Partial<Video>) => {
    try {
      const docRef = doc(db, 'videos', id);
      await updateDoc(docRef, videoData);
      await fetchVideos();
    } catch (err) {
      console.error('Error updating video:', err);
      throw new Error('Failed to update video');
    }
  }, [fetchVideos]);

  // Delete a video
  const deleteVideo = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
      await fetchVideos();
    } catch (err) {
      console.error('Error deleting video:', err);
      throw new Error('Failed to delete video');
    }
  }, [fetchVideos]);

  useEffect(() => {
    fetchVideos().catch((err) => {
      console.error('Unhandled error in fetchVideos:', err);
      setError('Failed to fetch videos');
      setLoading(false);
    });
  }, [fetchVideos]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    videos,
    loading,
    error,
    addVideo,
    updateVideo,
    deleteVideo,
    refetch: fetchVideos,
  }), [videos, loading, error, addVideo, updateVideo, deleteVideo, fetchVideos]);
}
