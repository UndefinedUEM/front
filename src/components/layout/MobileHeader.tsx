import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ScoutImage } from '@/assets/images';

interface MobileHeaderProps {
  title?: string;
}

const MobileHeader = ({ title = 'Presença Escoteira' }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          <img
            src={ScoutImage.scout1x}
            alt="Logo Presença Escoteira"
            style={{ width: '100%', height: '100%' }}
            srcSet={`${ScoutImage.scout1x} 1x, ${ScoutImage.scout2x} 2x, ${ScoutImage.scout3x} 3x`}
          />
        </div>
      </div>

      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <Link to="/profile">
        <Button variant="ghost" size="icon" className="text-foreground">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    </header>
  );
};

export default MobileHeader;
