import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Card from "@material-ui/core/Card";
import Amplify from "aws-amplify";
import Signup from "./components/Signup";
import Confirmation from "./components/Confirmation";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Calculator from "./components/Calculator";
import { COGNITO } from "./configs/aws";
import { DYNAMODB } from "./configs/awsdynamo";
import ProtectedRoute from "./components/ProtectedRoute";

// STARTS HERE DYNAMODB setup
import * as AWS from 'aws-sdk';
import { ConfigurationOptions } from 'aws-sdk';
// End importings

let metres = 0;

Amplify.configure({
  aws_cognito_region: COGNITO.REGION,
  aws_user_pools_id: COGNITO.USER_POOL_ID,
  aws_user_pools_web_client_id: COGNITO.APP_CLIENT_ID,
});

// Configuration connection to DynamoDB
const configuration: ConfigurationOptions = {
  region: DYNAMODB.region,
  secretAccessKey: DYNAMODB.secretAccessKey,
  accessKeyId: DYNAMODB.accessKeyId
}
AWS.config.update(configuration);
// ENDS HERE



const App: React.FC = () => {
  return (
    <Router>
      <Card style={{ width: 500, margin: "100px auto", padding: "40px" }}>
        <Switch>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/signin">
            <Login />
          </Route>
          <Route path="/confirmation">
            <Confirmation />
          </Route>
          <Route path="/">
            <ProtectedRoute component={Dashboard} />
          </Route>
        </Switch>
      </Card>
    </Router>
  );
};

export default App;
