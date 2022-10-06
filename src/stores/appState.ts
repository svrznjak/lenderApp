import { acceptHMRUpdate, defineStore } from "pinia";

export const useAppStateStore = defineStore("AppStateStore", {
  state: () => ({ scrollTopMemory: {} as scrollTopMemory }),
  actions: {
    saveScrollTop(url: string, scrollTop: number) {
      this.scrollTopMemory[url] = scrollTop;
    },
  },
  getters: {
    getScrollTop: (state) => {
      return (url: string): number => {
        return state.scrollTopMemory[url] || 0;
      };
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStateStore, import.meta.hot));
}

interface scrollTopMemory {
  [key: string]: number;
}
