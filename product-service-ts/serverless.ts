import cars from '@functions/cars';
import carsId from '@functions/carsId';
import { createCar } from '@functions/index';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'product-service-ts',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    // iamRoleStatements: [
    //   {
    //     Effect: 'Allow',
    //     Action: 'dynamodb:Scan',
    //     Resource: { 'Fn::GetAtt': ['ProductsTable', 'Arn'] },
    //   },
    //   {
    //     Effect: 'Allow',
    //     Action: 'dynamodb:Query',
    //     Resource: { 'Fn::GetAtt': ['ProductsTable', 'Arn'] },
    //   },
    //   {
    //     Effect: 'Allow',
    //     Action: 'dynamodb:PutItem',
    //     Resource: { 'Fn::GetAtt': ['ProductsTable', 'Arn'] },
    //   },
    //   {
    //     Effect: 'Allow',
    //     Action: 'dynamodb:Scan',
    //     Resource: { 'Fn::GetAtt': ['StocksTable', 'Arn'] },
    //   },
    //   {
    //     Effect: 'Allow',
    //     Action: 'dynamodb:Query',
    //     Resource: { 'Fn::GetAtt': ['StocksTable', 'Arn'] },
    //   },
    //   {
    //     Effect: 'Allow',
    //     Action: 'dynamodb:PutItem',
    //     Resource: { 'Fn::GetAtt': ['StocksTable', 'Arn'] },
    //   },
    // ],
  },
  functions: { cars, carsId, createCar },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'products',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'stocks',
          AttributeDefinitions: [
            {
              AttributeName: 'product_id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'product_id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
