import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore/lite';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface Image {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  uploadDate: string;
}

export function useImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalize = (c?: string) => (c || '').toLowerCase().replace(/\s+/g, '-');

  // Fetch all images from Firestore
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'images'));
      const imagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Image[];
      // Sort by most recent first based on uploadDate
      imagesData.sort((a, b) => {
        const ad = a.uploadDate ? new Date(a.uploadDate).getTime() : 0
        const bd = b.uploadDate ? new Date(b.uploadDate).getTime() : 0
        return bd - ad
      })
      setImages(imagesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new image
  const addImage = async (imageData: Omit<Image, 'id'>, file: File) => {
    try {
      // If adding a hero image, remove any existing hero images first
      const isHero = normalize(imageData.category) === 'hero-background' || normalize(imageData.category) === 'hero';
      if (isHero) {
        const existing = await getDocs(collection(db, 'images'));
        const toDelete = existing.docs
          .map(d => ({ id: d.id, ...(d.data() as any) }))
          .filter((img: any) => {
            const c = normalize(img.category);
            return c === 'hero-background' || c === 'hero' || c === 'background' || c === 'banner';
          });
        for (const img of toDelete) {
          try {
            if (img.imageUrl) {
              const storageRef = ref(storage, img.imageUrl);
              await deleteObject(storageRef).catch(() => {});
            }
          } catch {}
          await deleteDoc(doc(db, 'images', img.id)).catch(() => {});
        }
      }

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Add image data to Firestore
      const docRef = await addDoc(collection(db, 'images'), {
        ...imageData,
        imageUrl,
        uploadDate: new Date().toISOString(),
      });

      await fetchImages();
      return docRef.id;
    } catch (err) {
      console.error('Error adding image:', err);
      throw new Error('Failed to add image');
    }
  };

  // Update an existing image
  const updateImage = async (id: string, imageData: Partial<Image>, file?: File) => {
    try {
      const updateData: any = { ...imageData };

      // If a new file is provided, upload it
      if (file) {
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        updateData.imageUrl = await getDownloadURL(snapshot.ref);
      }

       // If updating to hero category, remove other hero images first
       if (imageData.category) {
         const n = normalize(imageData.category);
         const toHero = n === 'hero-background' || n === 'hero';
         if (toHero) {
           const existing = await getDocs(collection(db, 'images'));
           const toDelete = existing.docs
             .map(d => ({ id: d.id, ...(d.data() as any) }))
             .filter((img: any) => {
               if (img.id === id) return false; // don't delete the one we're updating
               const c = normalize(img.category);
               return c === 'hero-background' || c === 'hero' || c === 'background' || c === 'banner';
             });
           for (const img of toDelete) {
             try {
               if (img.imageUrl) {
                 const storageRef = ref(storage, img.imageUrl);
                 await deleteObject(storageRef).catch(() => {});
               }
             } catch {}
             await deleteDoc(doc(db, 'images', img.id)).catch(() => {});
           }
         }
       }

      // bump timestamp so updated images come first
      updateData.uploadDate = new Date().toISOString();
      const docRef = doc(db, 'images', id);
      await updateDoc(docRef, updateData);
      await fetchImages();
    } catch (err) {
      console.error('Error updating image:', err);
      throw new Error('Failed to update image');
    }
  };

  // Delete an image
  const deleteImage = async (id: string, imageUrl: string) => {
    try {
      // Delete from Storage
      if (imageUrl) {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef).catch(() => {
          // Ignore error if file doesn't exist
        });
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'images', id));
      await fetchImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      throw new Error('Failed to delete image');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    images,
    loading,
    error,
    addImage,
    updateImage,
    deleteImage,
    refetch: fetchImages,
  }), [images, loading, error, addImage, updateImage, deleteImage, fetchImages]);
}
