import { createListResource } from './createListResource';
import { ServiceCatalogService } from '../services/serviceCatalogService';
import type { ServiceItem } from '../types';

const { useResource, store } = createListResource<ServiceItem>(ServiceCatalogService.fetchAll);

export function useServices() {
  const { items, loading, error, userId } = useResource();

  // The Serviços editor works on the whole array at once (rename/reorder/add
  // consumables inline), so it's exposed as a functional updater rather than
  // one-field-at-a-time mutations, and persisted as a full replace.
  const setServices = (updater: (prev: ServiceItem[]) => ServiceItem[]) => {
    store.setState((s) => {
      const next = updater(s.items);
      if (userId) ServiceCatalogService.replaceAll(userId, next).catch(console.error);
      return { ...s, items: next };
    });
  };

  // Used once, at onboarding completion, to seed the initial catalog.
  const seedServices = (userId: string, services: ServiceItem[]) => {
    store.setState((s) => ({ ...s, items: services, userId }));
    return ServiceCatalogService.insertMany(userId, services);
  };

  return { services: items, loading, error, setServices, seedServices };
}
