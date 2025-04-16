import * as SQLite from "expo-sqlite";
import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite";

import { useCreatePersister } from "tinybase/ui-react";
import type { Store } from "tinybase/store";

export const useAndStartPersister = (store: Store) =>
  // Persist store to Expo SQLite or local storage; load once, then auto-save.
  useCreatePersister(
    store,
    (store) =>
      createExpoSqlitePersister(store, SQLite.openDatabaseSync("todos.db")),
    [],
    async (p) => {
      const persister = await p.load();
      persister.startAutoSave();
    },
  );
