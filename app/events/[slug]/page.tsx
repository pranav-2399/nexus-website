import { EventDetailPage } from "@/components/event-detail-page";

type EventPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EventPage({ params, searchParams }: EventPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const id = typeof query.id === "string" ? query.id : "";
  return <EventDetailPage eventId={id} eventSlug={slug} />;
}
