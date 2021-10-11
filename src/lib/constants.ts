export const config = {
	auth: {
		publicURL: import.meta.env.VITE_KRATOS_PUBLIC_URL || 'http://127.0.0.1:4433',
		adminURL: import.meta.env.VITE_KRATOS_ADMIN_URL || 'http://127.0.0.1:4434'
	}
};
