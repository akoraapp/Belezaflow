import { useEffect, useSyncExternalStore } from 'react';
import { useAuth } from './useAuth';
import { useServices } from './useServices';
import { ProfileService } from '../services/profileService';
import { createStore } from '../services/store';
import { ALL_SLOTS } from '../theme';
import type { OnboardingResult, Profile } from '../types';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  userId: string | null;
}

const profileStore = createStore<ProfileState>({ profile: null, loading: false, userId: null });

export function useProfile() {
  const { userId } = useAuth();
  const { seedServices } = useServices();

  useEffect(() => {
    if (!userId) {
      profileStore.setState({ profile: null, loading: false, userId: null });
      return;
    }
    if (profileStore.getState().userId === userId) return;
    let cancelled = false;
    profileStore.setState((s) => ({ ...s, loading: true }));
    ProfileService.fetch(userId)
      .then((profile) => {
        if (!cancelled) profileStore.setState({ profile, loading: false, userId });
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) profileStore.setState((s) => ({ ...s, loading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const state = useSyncExternalStore(profileStore.subscribe, profileStore.getState);

  const updateProfile = (patch: Partial<Profile>) => {
    profileStore.setState((s) => (s.profile ? { ...s, profile: { ...s.profile, ...patch } } : s));
    if (userId) ProfileService.update(userId, patch).catch(console.error);
  };

  const completeOnboarding = (data: OnboardingResult) => {
    const newProfile: Profile = {
      language: data.language,
      currency: data.currency,
      name: data.name,
      publicName: data.publicName,
      profession: data.profession,
      goal: data.goal,
      instagram: '',
      whatsapp: '',
      endereco: '',
      mapsLink: '',
      contactMethod: 'whatsapp',
      workingDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
      availableSlots: [...ALL_SLOTS],
      bufferMinutes: 0,
      cancellationNoticeHours: 24,
      rescheduleNoticeHours: 24,
    };
    profileStore.setState({ profile: newProfile, loading: false, userId });
    if (userId) {
      ProfileService.insert(userId, newProfile)
        .then(() => seedServices(userId, data.services))
        .catch(console.error);
    }
  };

  return { profile: state.profile, loading: state.loading, updateProfile, completeOnboarding };
}
