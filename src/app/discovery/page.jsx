import DiscoveryClient from '../../components/DiscoveryClient';
import { listDiscoveryEntities } from '../../lib/discoveryRepository';

export default async function DiscoveryPage({ searchParams }) {
  const params = await searchParams;
  const entities = await listDiscoveryEntities();

  return (
    <DiscoveryClient
      initialEntities={entities}
      initialQuery={params?.q || ''}
    />
  );
}
