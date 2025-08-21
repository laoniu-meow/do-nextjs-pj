import { useState, useEffect } from "react";

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
			console.log("Selected company record:", main);
			
			// Check both logo and logoUrl fields
			const logoValue = main.logoUrl ?? main.logo ?? "";
			console.log("Logo value from record:", logoValue);
			
			return logoValue.trim().length > 0 ? logoValue : null;
		};

		const normalizeLogoPath = (value: string): string => {
			console.log("Normalizing logo path:", value);
			
			// Already an absolute API path or remote URL
			if (value.startsWith("/api/assets/logo/")) {
				console.log("Already correct API path:", value);
				return value;
			}
			if (value.startsWith("http://") || value.startsWith("https://")) {
				console.log("Remote URL, using as-is:", value);
				return value;
			}

			// Allow direct public paths like /logos/...
			if (value.startsWith("/")) {
				console.log("Public path detected, using as-is:", value);
				return value;
			}

			// Extract filename and build our asset API path
			const filename = value.split("/").pop() ?? value;
			const apiPath = `/api/assets/logo/${filename}`;
			console.log("Constructed API path:", apiPath);
			return apiPath;
		};

		const fetchFromEndpoint = async (endpoint: string): Promise<string | null> => {
			const res = await fetch(endpoint, { cache: "no-store" });
			if (!res.ok) return null;
			const payload = (await res.json()) as ApiResponse<CompanyProfileRecord[]>;
			console.log(`API Response from ${endpoint}:`, payload);
			if (!payload.success) return null;
			const selected = selectLogoFromRecords(payload.data);
			console.log(`Selected logo from ${endpoint}:`, selected);
			return selected ? normalizeLogoPath(selected) : null;
		};

		const fetchCompanyLogo = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Prefer staging, then fallback to production
				const fromStaging = await fetchFromEndpoint("/api/company-profile/staging");
				console.log("Logo from staging:", fromStaging);
				const fromProduction = await fetchFromEndpoint("/api/company-profile/production");
				console.log("Logo from production:", fromProduction);
				const finalUrl = fromStaging ?? fromProduction;
				console.log("Final logo URL:", finalUrl);

				setLogoUrl(finalUrl ?? null);
			} catch (err) {
				console.error("Error fetching company logo:", err);
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

