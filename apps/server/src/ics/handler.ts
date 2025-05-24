import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context as AWSContext,
} from 'aws-lambda';
import { getICSWithCache, validateStayToken } from './functions';

export const handler: (
  event: APIGatewayProxyEventV2,
  context: AWSContext
) => Promise<APIGatewayProxyStructuredResultV2> = async (event, context) => {
  console.log(
    '-------------------------------------------------------------------------------'
  );

  try {
    // get token
    const token = event.pathParameters?.token;
    if (!token) return err(400, 'MISSING_TOKEN');

    // check validation
    const validated = await validateStayToken(token);
    if (!validated) return err(401, 'BAD_TOKEN');

    // get/generate ical
    const cal = await getICSWithCache();
    if (!cal) return err(500, 'SERVER_ERROR');

    // return ical
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/calendar' },
      isBase64Encoded: false,
      body: cal,
    };
  } catch (error) {
    console.log(error);
    return err(500, 'SERVER_ERROR');
  }
};

function err(
  code: number,
  error: unknown,
  log?: unknown
): APIGatewayProxyStructuredResultV2 {
  if (log) console.log(log);

  return {
    statusCode: code,
    headers: { 'Content-Type': 'application/json' },
    isBase64Encoded: false,

    body: JSON.stringify({ error }),
  };
}
