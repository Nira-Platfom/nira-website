import ExploreMarketplace from '@/components/ExploreMarketplace'

export const metadata = {
  title: 'Explore salons, spas & beauty shops — Nira',
  description: 'Browse every salon, spa and beauty shop on Nira in Dar es Salaam. Search by name, area, service, product, price or rating — then book or order with Nira.',
}

export default function ExplorePage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="pt-16">
      <ExploreMarketplace initialQuery={typeof searchParams.q === 'string' ? searchParams.q.slice(0, 100) : ''} />
    </div>
  )
}
