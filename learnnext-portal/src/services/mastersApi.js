/** Settings → CRM-synced masters: locations, people masters and SAP BP. (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import * as demo from '@/data/demoData';
import { clientStore } from './clientsApi';
import { mock } from './coreApi';

/* --------------------------------------------------------------- Location masters (Country / State / City) */
export const locationsApi = {
  /**
   * Countries, states and cities as flat rows (read-only — synced from the CRM portal):
   * countries { id, name, code, dial, states, cities }, states { id, name, country, gst, cities }, cities { id, name, state, country }
   */
  list: () => {
    const states = [];
    const cities = [];
    for (const [country, list] of Object.entries(demo.geoStates)) {
      for (const [name, gst, cityNames] of list) {
        states.push({ id: `st-${states.length + 1}`, name, country, gst, cities: cityNames.length });
        for (const city of cityNames) cities.push({ id: `ci-${cities.length + 1}`, name: city, state: name, country });
      }
    }
    const countries = demo.geoCountries.map((c) => ({ ...c, states: states.filter((s) => s.country === c.name).length, cities: cities.filter((x) => x.country === c.name).length }));
    return mock({ countries, states, cities, syncedAt: demo.geoCountries[0]?.syncedAt });
  },
};

/* --------------------------------------------------------------- People masters (Department / Designation / Role / Industry type) */
// All read-only — synced from the CRM portal. Each list also returns when it last synced.
const crmList = (rows) => mock({ rows: structuredClone(rows), syncedAt: rows[0]?.syncedAt });

export const peopleMastersApi = {
  /** Departments, each with how many designations sit in it */
  departments: () => crmList(demo.crmDepartments.map((d) => ({ ...d, designations: demo.crmDesignations.filter((x) => x.department === d.name).length }))),
  designations: () => crmList(demo.crmDesignations),
  roles: () => crmList(demo.crmRoles),
  /** Industry types, each with how many clients are in it */
  industries: () => crmList(demo.crmIndustries.map((x) => ({ ...x, clients: clientStore.filter((c) => c.industry === x.name).length }))),
};

/* --------------------------------------------------------------- SAP BP master */
export const sapBpApi = {
  /** The billing units (table columns) and every trainer's SAP Business Partner code per unit — read-only, from SAP */
  list: () => mock({ units: demo.sapBpUnits, trainers: structuredClone(demo.sapBpTrainers) }),
};
