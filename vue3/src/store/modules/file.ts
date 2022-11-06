import type { FileAuth } from '/#/store';

import { defineStore } from 'pinia';

import { FILE_AUTH_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';

interface FileState {
  fileAuth: Nullable<FileAuth>;
}

export const useFileStore = defineStore({
  id: 'app-file',
  state: (): FileState => ({
    fileAuth: Persistent.getLocal(FILE_AUTH_KEY),
  }),
  getters: {
    getFileAuth(): Nullable<FileAuth> {
      return this.fileAuth;
    },
  },
  actions: {
    setFileAuth(info: FileAuth) {
      this.fileAuth = Object.assign({}, this.fileAuth, info);
      Persistent.setLocal(FILE_AUTH_KEY, this.fileAuth, true);
    },
    resetFileAuth() {
      Persistent.removeLocal(FILE_AUTH_KEY, true);
      this.fileAuth = null;
    },
  },
});
