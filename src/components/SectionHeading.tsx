type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <p className="section-kicker">{eyebrow}</p>
      <h2 id={id} className="section-title">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
