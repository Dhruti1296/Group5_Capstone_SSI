export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");

  // Debug — remove this after fixing
  console.log("authFetch →", url);
  console.log("Token found:", token ? "YES ✓" : "NO ✗ (401 will follow)");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
};

// ### How it all fits together
// ```
// Login → backend returns { token, userName, role, email }
//       → saveToken(token) stores in localStorage
//       → setUser(...) stores user info in context

// Any protected API call → authFetch() reads token from localStorage
//                        → sends Authorization: Bearer <token> header
//                        → backend [Authorize] validates it

// Logout → logout() clears user from context
//        → useEffect clears localStorage token automatically
//        → navigate to /login
