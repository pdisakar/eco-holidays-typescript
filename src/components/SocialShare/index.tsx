// Define the props interface for the SocialShare component
interface SocialShareProps {
  title: string;
  url: string;
  classess?: string; // `classess` is an optional string
}

// Define the platform structure
interface Platform {
  name: string;
  url: string;
  icon: string;
}

const SocialShare = ({ title, url, classess }: SocialShareProps) => {
  const encodedURL: string = encodeURIComponent(url);
  const encodedTitle: string = encodeURIComponent(title);

  // Use a type annotation for the platforms array
  const platforms: Platform[] = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
      icon: "/icons.svg#facebook", // Add your icon paths
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodedURL}&text=${encodedTitle}`,
      icon: "/icons.svg#twitter", // Add your icon paths
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
      icon: "/icons.svg#linkedin",
    },
  ];

  return (
    <div
      className={`social-share flex gap-1 [&>.facebook]:bg-facebook [&>.twitter]:bg-twitter [&>.linkedin]:bg-linkedin ${
        classess || ""
      }`}
    >
      {platforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${platform.name}`}
          className={`text-white h-8 w-8 rounded inline-flex items-center justify-center ${platform.name.toLowerCase()} hover:opacity-80`}
        >
          <i className="icon h-4 w-4">
            <svg>
              <use xlinkHref={platform.icon} fill="currentColor" />
            </svg>
          </i>
        </a>
      ))}
    </div>
  );
};

export default SocialShare;