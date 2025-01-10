interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  description?: string;
}

export function DashboardHeader({
  heading,
  text,
  children,
  description
}: DashboardHeaderProps) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='grid gap-1'>
        <h1 className='font-heading text-3xl md:text-4xl'>{heading}</h1>
        {description && (
          <p className='text-lg text-muted-foreground'>{description}</p>
        )}
        {text && <p className='text-lg text-muted-foreground'>{text}</p>}
      </div>
      {children}
    </div>
  );
}
