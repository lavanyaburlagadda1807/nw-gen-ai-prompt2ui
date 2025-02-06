const endpoint = `nkb_auth_v2/login/v1/`;

export async function fetchAuthenticationDetails(authCode: string) {
  const requestObject = {
    code: authCode,
  };

  const response = await fetch(`${process.env.NKB_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientKeyDetailsId: 1,
      data: JSON.stringify(JSON.stringify(requestObject)),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch authentication details');
  }

  const data = await response.json();

  return data;
}
