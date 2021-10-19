import React from "react";
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Toast } from "./../utils/notifications";
import { Auth } from "aws-amplify";
import LockIcon from "@material-ui/icons/Lock";
import { Link, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import { Box } from "@material-ui/core";
import InputBase from '@material-ui/core/InputBase';
import { useInput } from "./../utils/forms";
import { useInputCheckbox } from "./../utils/forms";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Email } from "@material-ui/icons";
import Quote from "./Quote";
import MakeQuote from "./MakeQuote";

import * as AWS from 'aws-sdk';

import { fetchData } from "../AwsFunctions/fetch";
import { putData } from "../AwsFunctions/put";


const Field = styled(TextField)({
  margin: "10px 0",
});

const BootstrapInput = withStyles((theme: Theme) =>
    createStyles({
      root: {
        'label + &': {
          marginTop: theme.spacing(3),
        },
      },
      input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
          borderRadius: 4,
          borderColor: '#80bdff',
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
      },
    }),
  )(InputBase);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  }),
);

const Dashboard: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [quoteON, setQuoteON] = React.useState(false);
  const classes = useStyles();

  Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => console.log("currentAuthenticatedUser.attributes ===", user.attributes["email"]))
    .catch(err => console.log(err));
  Auth.currentAuthenticatedUser({ bypassCache: true })


  AWS.config.update({region:'us-east-2'});


  const quoteInfo = [
  { 'metres_quadrats': '100', 'projecte_arquitecte': 'false' }
  ];

  const quoteInfoJSONstring = JSON.stringify(quoteInfo);

  // DynamoDB
  const fetchDataFormDynamoDb = () => {
    fetchData('QuoteStorage');
  }
  const addDataToDynamoDB = async () => {
    const quoteData = {
      "quoteId": "004",
      "quoteInfo": quoteInfoJSONstring
    }
    await putData('QuoteStorage' , quoteData);
  }

  const { value: metres_construir, bind: bindMetresConstruir } = useInput("");
  const { value: terreny, bind: bindTerreny } = useInputCheckbox(false);
  const { value: localitat, bind: bindLocalitat } = useInput("");
  const { value: projecte_arquitecte, bind: bindProjecteArquitecte } = useInputCheckbox(false);
  //const { value: plantes, bind: plantes } = useInput("");
  //const { value: habitacions, bind: bindHabitacions } = useInput("");
  //const { value: banys, bind: bindBanys } = useInput("");
  const { value: garatge, bind: bindGaratge } = useInputCheckbox(false);
  const { value: metres_garatge_soterrat, bind: bindMetresGaratgeSoterrat } = useInput("");
  const { value: metres_garatge_planta, bind: bindMetresGaratgePlanta } = useInput("");
  const [plantes, setPlantes] = React.useState(0);
  const handleChangePlantes = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPlantes(event.target.value as number);
  };
  const [habitacions, setHabitacions] = React.useState(0);
  const handleChangeHabitacions = (event: React.ChangeEvent<{ value: unknown }>) => {
    setHabitacions(event.target.value as number);
  };
  const [banys, setBanys] = React.useState(0);
  const handleChangeBanys = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBanys(event.target.value as number);
  };

  const goToLinkedIn = () => {
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = "https://www.linkedin.com/in/mubbashir10/";
    a.click();
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      Toast("Success!!", "Logged out successfully!", "success");
      history.push("/signin");
    } catch (error) {
      Toast("Error!!", error.message, "danger");
    }
  };

  const handleCalculator = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);
    setQuoteON(true);
/*
    if (password !== confirmPassword) {
      Toast(
        "Error!!",
        "Password and Confirm Password should be same",
        "danger"
      );
      return;
    }
  
    try {
      await Auth.signUp({
        username: email,
        password: confirmPassword,
        attributes: {
          email,
          "custom:Name": name,
          "custom:phone_number": phone,
          "custom:City": city,
          "custom:iamarchitect": iamarchitect.toString(),
        },
      });
      Toast("Success!!", "Signup was successful", "success");
      history.push("/confirmation");
    } catch (error) {
      console.error(error);
      Toast("Error!!", error.message, "danger");
    }
    */
    
    //history.push("/quote");

    setLoading(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        style={{ marginRight: "20px" }}
        onClick={goToLinkedIn}
      >
        <LinkedInIcon /> My LinkedIn Profile
      </Button>

      <Button variant="contained" color="default" onClick={handleLogout}>
        <ExitToAppIcon /> Logout
      </Button>

      <Button onClick={() => fetchDataFormDynamoDb()}> Fetch </Button>
      <Button onClick={() => addDataToDynamoDB()}> Put </Button>

      <MakeQuote />


    </>
      
  );

  
};

export default Dashboard;
