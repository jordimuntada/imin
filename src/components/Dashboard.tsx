import React from "react";
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from "@material-ui/core/Button";
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import { useInput } from "./../utils/forms";
import { useInputCheckbox } from "./../utils/forms";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Email } from "@material-ui/icons";
import Quote from "./Quote";
import * as AWS from 'aws-sdk';

import { fetchData } from "../AwsFunctions/fetch";
import { putData } from "../AwsFunctions/put";
import { Box } from "@material-ui/core";

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

      <p>Consulta el presupuesto orientativo de la casa de madera que has diseñado. </p>
      <p style={{ fontSize: 12, marginBottom: "20px" }}>
        En I'm in for the planet  queremos cambiar el mundo! {" "}
      </p>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onSubmit={handleCalculator}
      >
          <Field label="Metres quadrats" {...bindMetresConstruir}/> <p> Metres quadrats construïts d'habitatge sense comptar pàrquing ni soterranis. 😊 </p>
          <FormGroup>
            <h3> Indica'ns si ja disposes d'un terreny en propietat </h3>
          <FormControlLabel
            control={<Switch checked={terreny} name="checked"  {...bindTerreny}       
            />}
            label="Sí, ja disposo d'un terreny"
          />
          
          </FormGroup>
          <Field label="Localitat" {...bindLocalitat} /> <p> On està ubicat el terreny? (El nostre radi d'actuació es limita a Catalunya) </p>
          <FormGroup>
            <h3> Vols que calculem el cost del projecte arquitectònic? 🙂 </h3>
            <FormControlLabel
              control={<Switch checked={projecte_arquitecte} name="checked" {...bindProjecteArquitecte}        
              />}
              label="Vull que calculeu el projecte arquitectònic"
            />
            
          </FormGroup>

          <h3> Explica'ns una mica més sobre casa teva 🙂 </h3>
          <br></br>
          <FormControl className={classes.margin}>
          <h3> Plantes </h3>
            
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={plantes}
              onChange={handleChangePlantes}
              input={<BootstrapInput />}
              
            >
              
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>+3</MenuItem>
            </Select>
          </FormControl>
          <br></br>
          <FormControl className={classes.margin}>
            <h3> Habitacions </h3>
            
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={habitacions}
              onChange={handleChangeHabitacions}
              input={<BootstrapInput />}
              
            >
              
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>+6</MenuItem>
            </Select>
          </FormControl>
          <br></br>

          <FormControl className={classes.margin}>
            <h3> Banys </h3>
            
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={banys}
                onChange={handleChangeBanys}
                input={<BootstrapInput />}
        
              >
              
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>+4</MenuItem>
            </Select>
          </FormControl>
          
          <br></br>
          
          <FormGroup>
            <h3> Vols que la teva casa tingui un garatge, ja sigui en planta o soterrat? 🙂 </h3>
            <FormControlLabel
              control={<Switch checked={garatge} name="checked"  {...bindGaratge}        
              />}
              label="Sí, vull garatge"
            />
            
          </FormGroup>

          <br></br>
          <p>Si vols comptar amb un pàrquing soterrat o bé amb un pàrquing en planta. Indica'n els metres quadrats.</p>
          <Field label="Garatge soterrat" {...bindMetresGaratgeSoterrat}/> 
          <Field label="Garatge en planta"  {...bindMetresGaratgePlanta}/>
          <p> Metres quadrats construïts d'habitatge sense comptar pàrquing ni soterranis. 😊 </p>

          <br></br>
          <TextField label="Message"/>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={loading}
          >
            {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
            Calcular
          </Button>
      </form>
        
        {quoteON ? <Quote metres_a_construir={metres_construir} terreny={terreny} projecte_arquitecte={projecte_arquitecte} localitat={localitat} garatge={garatge} metres_garatge_soterrat={metres_garatge_soterrat} metres_garatge_planta={metres_garatge_planta} plantes={plantes} habitacions={habitacions} banys={banys} /> : "RETEEEEEIX" }



    </>
      
  );

  
};

export default Dashboard;
