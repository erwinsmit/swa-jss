// GetJssEditingSecret it is not exported from the package, so we have to copy it here
export const getJssEditingSecret = (): string => {
  const secret = process.env.JSS_EDITING_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('The JSS_EDITING_SECRET environment variable is missing or invalid.');
  }
  return secret;
};

export const QUERY_PARAM_EDITING_SECRET = 'secret';
