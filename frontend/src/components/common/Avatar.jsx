/**
 * Avatar - User avatar component using DaisyUI
 */
import React from 'react';

export function Avatar({
  name,
  email,
  src,
  size = 'md',
  className = '',
}) {
  // Get initials from name or email
  const getInitials = () => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const sizeClasses = {
    sm: 'w-8',
    md: 'w-10',
    lg: 'w-12',
    xl: 'w-16',
    '2xl': 'w-20',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  if (src) {
    return (
      <div className={`avatar ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full`}>
          <img src={src} alt={name || 'Avatar'} />
        </div>
      </div>
    );
  }

  return (
    <div className={`avatar placeholder ${className}`}>
      <div className={`bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full ${sizeClasses[size]}`}>
        <span className={textSizeClasses[size]}>{getInitials()}</span>
      </div>
    </div>
  );
}

// Avatar with name and role
export function UserAvatar({
  name,
  email,
  role,
  src,
  size = 'md',
  showRole = true,
  className = '',
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar name={name} email={email} src={src} size={size} />
      <div>
        <p className="font-medium text-base-content">{name || email?.split('@')[0] || 'User'}</p>
        {showRole && role && (
          <p className="text-base-content/60 text-sm">{role.toUpperCase()}</p>
        )}
      </div>
    </div>
  );
}

// Avatar group (stacked avatars)
export function AvatarGroup({ users = [], max = 4, size = 'sm' }) {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  const sizeClasses = {
    sm: 'w-8',
    md: 'w-10',
    lg: 'w-12',
  };

  return (
    <div className="avatar-group -space-x-4 rtl:space-x-reverse">
      {displayUsers.map((user, index) => (
        <div key={user.id || index} className="avatar">
          {user.avatar ? (
            <div className={sizeClasses[size]}>
              <img src={user.avatar} alt={user.name || 'User'} />
            </div>
          ) : (
            <div className="avatar placeholder">
              <div className={`bg-gradient-to-br from-primary to-secondary text-primary-content ${sizeClasses[size]}`}>
                <span className="text-xs">
                  {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className="avatar placeholder">
          <div className={`bg-neutral text-neutral-content ${sizeClasses[size]}`}>
            <span className="text-xs">+{remaining}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Avatar;
