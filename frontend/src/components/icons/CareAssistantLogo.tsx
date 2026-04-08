export function CareAssistantLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 8H26C28.7614 8 31 10.2386 31 13V28C31 30.7614 28.7614 33 26 33H14C11.2386 33 9 30.7614 9 28V13C9 10.2386 11.2386 8 14 8Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M16 8.5C16 6.567 17.567 5 19.5 5H20.5C22.433 5 24 6.567 24 8.5V10H16V8.5Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M20 15V25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 20H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M15 29H25"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}
