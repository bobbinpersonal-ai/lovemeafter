import Image from 'next/image';

export default function ProductGallery({ images, title }) {
  if (!images?.length) {
    return <div className="aspect-[4/5] w-full bg-platinum/5 md:sticky md:top-24" />;
  }

  return (
    <div className="md:sticky md:top-24 md:self-start">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {images.map((image, i) => (
          <div key={image.url} className={`relative aspect-[4/5] overflow-hidden bg-platinum/5 ${i === 0 ? 'md:col-span-2' : ''}`}>
            <Image
              src={image.url}
              alt={image.altText || `${title} — image ${i + 1}`}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
