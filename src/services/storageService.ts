import { NichinanSpot, OperationInfo, Reservation, CongestionLevel } from '../types';
import { initialOperationInfo, nichinanSpotsData, sampleReservations } from '../data/initialData';

const OPERATION_STORAGE_KEY = 'nichinan_trip_operation_v2';
const RESERVATIONS_STORAGE_KEY = 'nichinan_trip_reservations_v2';
const MY_RESERVATIONS_KEY = 'nichinan_trip_my_reservations_v2';
const SPOTS_STORAGE_KEY = 'nichinan_trip_spots_v2';
const FAVORITES_STORAGE_KEY = 'nichinan_trip_favorites_v1';

export const storageService = {
  getOperationInfo(): OperationInfo {
    try {
      const data = localStorage.getItem(OPERATION_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return initialOperationInfo;
  },

  updateOperationInfo(info: Partial<OperationInfo>): OperationInfo {
    const current = this.getOperationInfo();
    const updated: OperationInfo = {
      ...current,
      ...info,
      lastUpdated: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    };
    try {
      localStorage.setItem(OPERATION_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('nichinan_data_update'));
    } catch {
      // ignore
    }
    return updated;
  },

  getSpots(): NichinanSpot[] {
    try {
      const data = localStorage.getItem(SPOTS_STORAGE_KEY);
      if (data) {
        const parsed: NichinanSpot[] = JSON.parse(data);
        const merged = parsed.map((item) => {
          const fresh = nichinanSpotsData.find((s) => s.id === item.id);
          return fresh ? { ...item, imageUrl: fresh.imageUrl || item.imageUrl } : item;
        });
        try {
          localStorage.setItem(SPOTS_STORAGE_KEY, JSON.stringify(merged));
        } catch {}
        return merged;
      }
    } catch {
      // ignore
    }
    try {
      localStorage.setItem(SPOTS_STORAGE_KEY, JSON.stringify(nichinanSpotsData));
    } catch {
      // ignore
    }
    return nichinanSpotsData;
  },

  updateSpotCongestion(spotId: string, congestion: CongestionLevel): void {
    const spots = this.getSpots();
    const updated = spots.map((s) => (s.id === spotId ? { ...s, currentCongestion: congestion } : s));
    try {
      localStorage.setItem(SPOTS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('nichinan_data_update'));
    } catch {
      // ignore
    }
  },

  getAllReservations(): Reservation[] {
    try {
      const data = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    // initialize with sample reservations
    try {
      localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(sampleReservations));
    } catch {
      // ignore
    }
    return sampleReservations;
  },

  getMyReservationIds(): string[] {
    try {
      const data = localStorage.getItem(MY_RESERVATIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return ['NCN-20260903-8821']; // default demo ticket
  },

  addReservation(reservation: Reservation): void {
    const list = this.getAllReservations();
    const updated = [reservation, ...list];
    try {
      localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(updated));

      const myIds = this.getMyReservationIds();
      if (!myIds.includes(reservation.id)) {
        localStorage.setItem(MY_RESERVATIONS_KEY, JSON.stringify([reservation.id, ...myIds]));
      }
      window.dispatchEvent(new CustomEvent('nichinan_data_update'));
    } catch {
      // ignore
    }
  },

  updateReservationStatus(id: string, status: 'valid' | 'used' | 'cancelled'): Reservation | null {
    const list = this.getAllReservations();
    let updatedTarget: Reservation | null = null;
    const updated = list.map((res) => {
      if (res.id === id || res.ticketNumber === id) {
        updatedTarget = {
          ...res,
          status,
          usedAt: status === 'used' ? new Date().toLocaleString('ja-JP') : res.usedAt,
        };
        return updatedTarget;
      }
      return res;
    });

    if (updatedTarget) {
      try {
        localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('nichinan_data_update'));
      } catch {
        // ignore
      }
    }
    return updatedTarget;
  },

  getFavoriteSpotIds(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  },

  toggleFavoriteSpot(spotId: string): string[] {
    const current = this.getFavoriteSpotIds();
    const exists = current.includes(spotId);
    const updated = exists ? current.filter((id) => id !== spotId) : [spotId, ...current];
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('nichinan_data_update'));
    } catch {
      // ignore
    }
    return updated;
  },
};
