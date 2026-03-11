import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore/lite';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email?: string;
  phone?: string;
}

export function useTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all team members from Firestore
  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'team'));
      const teamData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[];
      setTeamMembers(teamData);
      setError(null);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new team member
  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>, file?: File) => {
    try {
      let imageUrl = memberData.imageUrl;

      // Upload image to Firebase Storage if file is provided
      if (file) {
        const storageRef = ref(storage, `team/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Add team member data to Firestore
      const docRef = await addDoc(collection(db, 'team'), {
        ...memberData,
        imageUrl,
      });

      await fetchTeamMembers();
      return docRef.id;
    } catch (err) {
      console.error('Error adding team member:', err);
      throw new Error('Failed to add team member');
    }
  };

  // Update an existing team member
  const updateTeamMember = async (id: string, memberData: Partial<TeamMember>, file?: File) => {
    try {
      const updateData: any = { ...memberData };

      // If a new file is provided, upload it
      if (file) {
        const storageRef = ref(storage, `team/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        updateData.imageUrl = await getDownloadURL(snapshot.ref);
      }

      const docRef = doc(db, 'team', id);
      await updateDoc(docRef, updateData);
      await fetchTeamMembers();
    } catch (err) {
      console.error('Error updating team member:', err);
      throw new Error('Failed to update team member');
    }
  };

  // Delete a team member
  const deleteTeamMember = async (id: string, imageUrl?: string) => {
    try {
      // Delete from Storage if image exists
      if (imageUrl) {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef).catch(() => {
          // Ignore error if file doesn't exist
        });
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'team', id));
      await fetchTeamMembers();
    } catch (err) {
      console.error('Error deleting team member:', err);
      throw new Error('Failed to delete team member');
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    teamMembers,
    loading,
    error,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refetch: fetchTeamMembers,
  }), [teamMembers, loading, error, addTeamMember, updateTeamMember, deleteTeamMember, fetchTeamMembers]);
}
