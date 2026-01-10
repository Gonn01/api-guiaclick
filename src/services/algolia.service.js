import { algoliasearch } from "algoliasearch";
import { ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, ALGOLIA_INDEX_NAME } from "../config/env.js";
import { logYellow, logRed, logGreen } from "../utils/logs_custom.js";

export class AlgoliaService {
  constructor({ manualsRepository }) {
    this.manualsRepository = manualsRepository;
    this.client = null;

    if (ALGOLIA_APP_ID && ALGOLIA_ADMIN_KEY) {
      this.client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
    } else {
      logYellow(
        "Algolia env vars not set (ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY). Indexing is disabled."
      );
    }
  }

  async reindexManuals() {
    if (!this.client) return false;

    try {
      const manuals = await this.manualsRepository.listPublic({ log: false });

      const records = manuals.map((record) => ({
        ...record,
        objectID: record.id,
      }));

      // Clear and reindex (simple approach)
      await this.client.clearObjects({ indexName: ALGOLIA_INDEX_NAME });
      await this.client.saveObjects({ indexName: ALGOLIA_INDEX_NAME, objects: records });

      logGreen(`Algolia reindex ok: ${records.length} manuals`);
      return true;
    } catch (err) {
      logRed(`Algolia reindex failed: ${err?.message || err}`);
      return false;
    }
  }
}
