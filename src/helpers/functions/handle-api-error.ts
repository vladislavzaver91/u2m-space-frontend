export const handleApiError = (error: any, defaultMessage: string): string => {
	return error.response?.data?.error || defaultMessage
}
