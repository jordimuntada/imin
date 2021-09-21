import * as AWS from 'aws-sdk';
import { DYNAMODB } from "../configs/awsdynamo";
import { ConfigurationOptions } from 'aws-sdk';

// Configuration connection to DynamoDB
const configuration: ConfigurationOptions = {
    region: DYNAMODB.region,
    secretAccessKey: DYNAMODB.secretAccessKey,
    accessKeyId: DYNAMODB.accessKeyId
  }
AWS.config.update(configuration);
// ENDS HERE

const docClient = new AWS.DynamoDB.DocumentClient();


export const putData = (tableName: any , data: any) => {
    var params = {
        TableName: tableName,
        Item: data
    }
    console.log("PARAMS ==== ", params);
    docClient.put(params, function (err, data) {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Success', data);
        }
    })
}