interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
}

export function Avatar({ src, alt, size = 40 }: AvatarProps) {
  const url = src || `https://picsum.photos/seed/${encodeURIComponent(alt)}/100/100`;
  return (
    <div
      className="relative overflow-hidden rounded-full bg-gray-100"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
