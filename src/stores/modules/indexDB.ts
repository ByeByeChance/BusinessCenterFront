import { defineStore } from 'pinia';
import localforage from 'localforage';

export const useIndexDBStore = defineStore({
  id: 'geeker-indexDB',
  state: () => ({
    filesDB: localforage.createInstance({
      name: 'filesDB'
    }),
    usersDB: localforage.createInstance({
      name: 'usersDB'
    })
  }),
  getters: {},
  actions: {
    async setFilesDB(key: string, value: any) {
      this.filesDB.setItem(key, value);
    }
  }
});
