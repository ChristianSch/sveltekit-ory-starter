export const config = {
	auth: {
		publicUrl: import.meta.env.VITE_KRATOS_PUBLIC_URL || 'http://127.0.0.1:4433',
		adminUrl: import.meta.env.VITE_KRATOS_ADMIN_URL || 'http://127.0.0.1:4434',
		get logoutUrl() {
			return `${this.publicUrl}/self-service/browser/flows/logout`;
		}
	}
};
