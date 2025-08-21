import { useState, useEffect } from "react";
import { logger } from '@/lib/logger';

interface CompanyLogoData {
	logoUrl: string | null;
	isLoading: boolean;
	error: string | null;
}

interface CompanyProfileRecord {
	logo?: string | null;
	logoUrl?: string | null;
	isMainCompany?: boolean | null;
}

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export function useCompanyLogo(): CompanyLogoData {
	const [logoUrl, setLogoUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const selectLogoFromRecords = (records: CompanyProfileRecord[] | undefined): string | null => {
			if (!records || records.length === 0) return null;
			const main = records.find((r) => r.isMainCompany) ?? records[0];
			// debug removed for lint compliance
			
			// Check both logo and logoUrl fields
			const logoValue = main.logoUrl ?? main.logo ?? "";
			// debug removed for lint compliance
			
			return logoValue.trim().length > 0 ? logoValue : null;
		};

		const normalizeLogoPath = (value: string): string => {
			// debug removed for lint compliance
			
			// Already an absolute API path or remote URL
			if (value.startsWith("/api/assets/logo/")) {
				// debug removed for lint compliance
				return value;
			}
			if (value.startsWith("http://") || value.startsWith("https://")) {
				// debug removed for lint compliance
				return value;
			}

			// Allow direct public paths like /logos/...
			if (value.startsWith("/")) {
				// debug removed for lint compliance
				return value;
			}

			// Extract filename and build our asset API path
			const filename = value.split("/").pop() ?? value;
			const apiPath = `/api/assets/logo/${filename}`;
			// debug removed for lint compliance
			return apiPath;
		};

		const fetchFromEndpoint = async (endpoint: string): Promise<string | null> => {
			const res = await fetch(endpoint, { cache: "no-store" });
			if (!res.ok) return null;
			const payload = (await res.json()) as ApiResponse<CompanyProfileRecord[]>;
			// debug removed for lint compliance
			if (!payload.success) return null;
			const selected = selectLogoFromRecords(payload.data);
			// debug removed for lint compliance
			return selected ? normalizeLogoPath(selected) : null;
		};

		const fetchCompanyLogo = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Prefer staging, then fallback to production
				const fromStaging = await fetchFromEndpoint("/api/company-profile/staging");
				// debug removed for lint compliance
				const fromProduction = await fetchFromEndpoint("/api/company-profile/production");
				// debug removed for lint compliance
				const finalUrl = fromStaging ?? fromProduction;
				// debug removed for lint compliance

				setLogoUrl(finalUrl ?? null);
			} catch (err) {
				logger.error('Error fetching company logo', { error: err instanceof Error ? err.message : String(err) });
				setError("Failed to fetch company logo");
				setLogoUrl(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCompanyLogo();
	}, []);

	return { logoUrl, isLoading, error };
}

