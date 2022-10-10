import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { staticData } from './staticData';

const cars: ValidatedEventAPIGatewayProxyEvent<void> = async () => {
  return formatJSONResponse({
    cars: staticData,
  });
};

export const main = middyfy(cars);
