import { config } from '$lib/constants';
import type { Load } from '@sveltejs/kit';
import type { AuthFlowType, FlowTypeId } from '$lib/auth';

export const createLoad =
	(flowType: FlowTypeId): Load =>
	async ({ page, fetch }) => {
		const flowID = page.query.get('flow');
		const res = await fetch(`/api/auth/${flowType}`, {
			headers: { flow_id: flowID },
			credentials: 'include'
		});

		if (!res.ok) {
			return {
				status: 302,
				redirect: `${config.auth.publicURL}/self-service/${flowType}/browser`
			};
		}

		const { data: flow }: { status: number; data: AuthFlowType } = await res.json();

		return {
			props: { authUi: flow.ui }
		};
	};
