// src/store/fridgeStore.ts
import { create } from "zustand";

interface FridgeStore {
    favorites: Record<string, boolean>; // fridgeId별 즐겨찾기 상태
    toggleFavorite: (id: string) => void;
}

export const useFridgeStore = create<FridgeStore>((set) => ({
    favorites: {},
    toggleFavorite: (id: string) =>
        set((state) => ({
            favorites: { ...state.favorites, [id]: !state.favorites[id] },
        })),
}));
