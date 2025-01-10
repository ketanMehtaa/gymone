import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { getInitials } from '@/lib/utils';

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'image' | 'name'>;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage alt='Picture' src={user.image} />
      ) : (
        <AvatarFallback>
          {user.name ? (
            getInitials(user.name)
          ) : (
            <Icons.user className='h-4 w-4' />
          )}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
