import React from "react";
import CSS from "csstype";
import { useInput } from "./../utils/forms";
import { useInputCheckbox } from "./../utils/forms";
import { Toast } from "../utils/notifications";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import Quote from "./Quote";
import {QuoteProperties} from "../interfaces/QuoteProperties";
// TABLE MATERIAL UI
import InputBase from '@material-ui/core/InputBase';
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider
} from '@material-ui/core/styles';
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';

import * as AWS from 'aws-sdk';

import { fetchData } from "../AwsFunctions/fetch";
import { putData } from "../AwsFunctions/put";

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


//CSS
/*require('./css/invoice.css');*/
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    table: {
        //minWidth: "650px",
        //background: "white",
        maxWidth:"700px",
        //maxHeight: "400px",
        fontSize: "2px",
        color: 'red'
      },
      logo: {
        maxWidth: 160,
      },
  }),
);

const Field = styled(TextField)({
  margin: "10px 0",
});

const DLink = styled(Link)({
  margin: "15px 0",
  textAlign: "right",
});

let theme = createTheme({
  overrides: {
    MuiTableCell: {
      root: {
        //padding: "1px 1px",
        background: "green",
        margin: "0px",
        fontSize: "3px"
      }
    }
  }
});
theme = responsiveFontSizes(theme);


const ItemLogo = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0
}));

const ItemTip = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0),
  marginLeft: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  elevation: 0
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  elevation: 0
}));


const MakeQuote: React.FC = () => {

  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [quoteON, setQuoteON] = React.useState(false);
  const classes = useStyles();
  
/*
  Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => console.log("currentAuthenticatedUser.attributes ===", user.attributes["email"]))
    .catch(err => console.log(err));
  Auth.currentAuthenticatedUser({ bypassCache: true })


  AWS.config.update({region:'us-east-2'});
*/

  const quoteInfo = [
  { 'metres_quadrats': '100', 
  'projecte_arquitecte': 'false' }
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

  const { value: email, bind: bindEmail } = useInput("");
  const { value: code, bind: bindCode } = useInput("");
  const { value: metros_cuadrados_construidos, bind: bindMetrosCuadradosConstruidos } = useInput("");

  const { value: metres_construir, bind: bindMetresConstruir } = useInput("");
  const { value: terreny, bind: bindTerreny } = useInput("0");
  const { value: localitat, bind: bindLocalitat } = useInput("");
  const { value: projecte_arquitecte, bind: bindProjecteArquitecte } = useInput("");
  //const { value: plantes, bind: plantes } = useInput("");
  //const { value: habitacions, bind: bindHabitacions } = useInput("");
  //const { value: banys, bind: bindBanys } = useInput("");
  const { value: garatge, bind: bindGaratge } = useInput("0");
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

  const makePDFinvoice  = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);
    let input1;
    let pdfWidth=1225/2;
    let pdfHeight=791*3;
    input1 = document.getElementById('wholeDiv') as HTMLCanvasElement;
    const logoDivPDF = html2canvas(input1)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF("p", "px", [pdfWidth, pdfHeight]);
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        //pdf.addImage(imgData, 'PNG', 100, height/2,  0, 0, "pressu", "FAST", 0);
        pdf.addImage(imgData, 'PNG', 25*2, 25,  pdfWidth, 0, "pressu", "FAST", 0);
        // pdf.output('dataurlnewwindow');
        pdf.save("pressupost.pdf");
        return pdf;
      });
    //pdfBuffer = (await logoDivPDF).output('arraybuffer');
    setLoading(false);
}

  const handleSubmit = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await Auth.confirmSignUp(email, code);
      Toast("Success!!", "Verified Successfully", "success");
      history.push("/signin");
    } catch (error) {
      Toast("Error!!", error.message, "danger");
    }
    setLoading(false);
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
            
            
            

            <FormControl component="fieldset">
            <FormLabel component="legend"><h3> Indica'ns si ja disposes d'un terreny en propietat </h3></FormLabel>
            <RadioGroup
                aria-label="terreny"
                defaultValue={"0"}
                name="radio-buttons-group-terreny"
                {...bindTerreny}
            >
                <FormControlLabel  value={"0"} control={<Radio />} label="No, no disposo d'un terreny" />
                <FormControlLabel  value={"1"} control={<Radio />} label="Sí, ja disposo d'un terreny" />

            </RadioGroup>
            </FormControl>

            <p> On està ubicat el terreny? (El nostre radi d'actuació es limita a Catalunya) </p>
            <Field label="Localitat" {...bindLocalitat} /> 


            <FormControl component="fieldset">
            <FormLabel component="legend">Vols que calculem el cost del projecte arquitectònic? 🙂</FormLabel>
            <RadioGroup
                aria-label="projarq"
                defaultValue="Calcular"
                name="radio-buttons-group-projarq"
                {...bindProjecteArquitecte}
            >
                <FormControlLabel  value="Calcular" control={<Radio />} label="Vull que calculeu el projecte arquitectònic" />
                <FormControlLabel  value="noCalcular" control={<Radio />} label="No, no vull que calculeu el projecte arquitectònic" />
                <FormControlLabel value="arq" control={<Radio />} label="Sóc arquitecte/a" />
            </RadioGroup>
            </FormControl>

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
            
            <FormControl component="fieldset">
                <FormLabel component="legend"> <p> Vols que la teva casa tingui un garatge, ja sigui en planta o soterrat? 🙂 </p></FormLabel>
                <RadioGroup
                    aria-label="garatge"
                    defaultValue="0"
                    name="radio-buttons-group-garatge"
                    {...bindGaratge}
                >
                    <FormControlLabel  value="1" control={<Radio />} label="Sí, vull garatge" />
                    <FormControlLabel  value="0" control={<Radio />} label="No, no vull garatge" />
                </RadioGroup>
            </FormControl>

            {
            garatge === "1" ? 
            <React.Fragment>
              <br></br>
              <p>Si vols comptar amb un pàrquing soterrat o bé amb un pàrquing en planta. Indica'n els metres quadrats.</p>
              <Field label="Garatge soterrat" {...bindMetresGaratgeSoterrat}/> 
              <Field label="Garatge en planta"  {...bindMetresGaratgePlanta}/>
              <p> Metres quadrats construïts d'habitatge sense comptar pàrquing ni soterranis. 😊 </p>
            </React.Fragment>
             : null }
            
            

            <br></br>
            <TextField label="Comentaris"/>
            <Divider  orientation="horizontal" flexItem />
            <Divider  orientation="horizontal" flexItem />
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
            
            <Divider orientation="horizontal" flexItem />
            <Divider orientation="horizontal" flexItem />
        </form>
        {quoteON ? <Quote 
            metres_a_construir={metres_construir} 
            terreny={terreny} 
            projecte_arquitecte={projecte_arquitecte}
            localitat={localitat} 
            garatge={garatge} 
            metres_garatge_soterrat={metres_garatge_soterrat} 
            metres_garatge_planta={metres_garatge_planta} 
            plantes={plantes} 
            habitacions={habitacions} 
            banys={banys} 
            /> : null }
    </>
  );
};

export default MakeQuote;
function metres_a_construir(arg0: string, metres_a_construir: any) {
  throw new Error("Function not implemented.");
}