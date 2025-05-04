import React from "react"

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}
const colors = {
  border: "#e6e8eb",
  textLight: "#718096",
}

// 2) The Google “G” icon as a React component:
const GoogleIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
  >
    <path
      fill="#EA4335"
      d="M9 3.48c1.69 0 2.85.73 3.5 1.34l2.56-2.49C13.46.86 11.42 0 9 0 5.48 0 2.44 1.96 1 4.9l2.62 2.03C4.6 5.1 6.62 3.48 9 3.48z"
    />
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84A4.15 4.15 0 018.52 14c-.7 0-1.33-.2-1.87-.54l-2.62 2.03C4.4 17.86 6.68 18 9 18c5 0 8.64-3.28 8.64-8.8z"
    />
    <path
      fill="#FBBC05"
      d="M3.16 10.54a5.21 5.21 0 01-.27-1.64 5.2 5.2 0 01.27-1.64L.54 5.23A8.91 8.91 0 000 9c0 1.44.34 2.8.94 3.97l2.22-2.43z"
    />
    <path
      fill="#34A853"
      d="M9 17.94c2.32 0 4.28-.76 5.7-2.06l-2.62-2.03c-.72.48-1.63.76-3.08.76-2.4 0-4.43-1.62-5.14-3.82L.94 14c1.45 3.94 4.93 5.94 8.06 5.94z"
    />
    <path fill="none" d="M0 0h18v18H0z" />
  </svg>
)
export default GoogleIcon;