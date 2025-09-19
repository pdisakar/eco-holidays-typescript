interface SocialShareProps {
  title: string;
  url?: string; 
  classess?: string; 
}

interface SocialShareProps {
  title: string;
  url?: string; 
  classess?: string;
}

interface Platform {
  name: string;
  url: string;
  icon: string;
}

const SocialShare = ({ title, url, classess }: SocialShareProps) => {
  if (!url) return null;

  const encodedURL = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const platforms: Platform[] = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
      icon: '/icons.svg#facebook',
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodedURL}&text=${encodedTitle}`,
      icon: '/icons.svg#twitter',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
      icon: '/icons.svg#linkedin',
    },
  ];

  return (
    <div className={`social-share flex gap-1 ${classess || ''}`}>
      {platforms.map(platform => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${platform.name}`}
          className={`text-white h-8 w-8 rounded inline-flex items-center justify-center ${platform.name.toLowerCase()} hover:opacity-80`}>
          <i className="icon h-4 w-4">
            <svg>
              <use
                xlinkHref={platform.icon}
                fill="currentColor"
              />
            </svg>
          </i>
        </a>
      ))}
    </div>
  );
};


export default SocialShare;