import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CONTAINER_DEFINITIONS, getContainerDefinition } from '@/config/containerDefinitions';

export function generateStaticParams(): Array<{ id: string }> {
  return CONTAINER_DEFINITIONS.map(container => ({ id: container.id }));
}

export default function ContainerDetailPage({ params }: { params: { id: string } }) {
  const container = getContainerDefinition(params.id);

  if (!container) {
    notFound();
  }

  return (
    <main
      className="container-detail-page"
      data-container-atmosphere={container.atmosphere}
    >
      <Link className="btn-ghost container-detail-back" href="/containers">
        Back to containers
      </Link>

      <section className="container-detail-card">
        <p className="container-card__category">
          {container.category}
        </p>
        <h1 className="container-card__title">
          {container.name}
        </h1>
        <p className="container-card__tagline">
          {container.tagline}
        </p>
        <p className="container-detail-copy">
          {container.description}
        </p>
        <Link className="btn-primary container-detail-action" href={`/containers/${container.id}/opening`}>
          Enter the container
        </Link>
      </section>
    </main>
  );
}
