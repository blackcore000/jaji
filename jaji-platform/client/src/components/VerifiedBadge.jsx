export default function VerifiedBadge({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      aria-label="Doğrulanmış hesap"
    >
      <circle cx="8" cy="8" r="8" fill="#1DA1F2" />
      <path
        d="M4.5 8.2l2.0 2.1 5.0-5.0"
        stroke="#fff"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
