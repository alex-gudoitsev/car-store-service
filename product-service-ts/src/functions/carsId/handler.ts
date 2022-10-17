import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { staticData } from './staticData';
import { ICar } from './types';

const carsId: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
  const car = staticData.find(
    (car: ICar) => car.id === Number(event.pathParameters.id)
  );

  return formatJSONResponse({
    car,
  });
};

export const main = middyfy(carsId);
