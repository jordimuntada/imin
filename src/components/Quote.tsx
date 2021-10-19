import React from "react";
import CSS from "csstype";
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";
import { useInput } from "../utils/forms";
import { Toast } from "../utils/notifications";
import { Auth } from "aws-amplify";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link, useHistory } from "react-router-dom";
import {QuoteProperties} from "../interfaces/QuoteProperties";
// TABLE MATERIAL UI
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


//CSS
/*require('./css/invoice.css');*/

const useStyles = makeStyles({
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
});

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


const Quote: React.FC <QuoteProperties> = (props) => {
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

  const classes = useStyles();
  console.log("CLASSES ARE = ", classes);
  console.log("PROPS ARE = ", props);

  const { value: email, bind: bindEmail } = useInput("");
  const { value: code, bind: bindCode } = useInput("");
  const { value: metros_cuadrados_construidos, bind: bindMetrosCuadradosConstruidos } = useInput("");

  function calculateTotalConstruction(){
    const preuMetreQuadrat = 1200;
    return (Number(props.metres_a_construir) * preuMetreQuadrat) + Number(props.metres_garatge_planta) * preuMetreQuadrat;
  }

  function calculateTotalProjArq(){
    const preuMetreQuadratArq = 180;
    return Number(props.metres_a_construir) * preuMetreQuadratArq;
  }

  function calculateEscomeses(){
    const preuUnitatEscomeses = 55;
    return Number(props.metres_a_construir) * preuUnitatEscomeses;
  }

  function CalculateFonamentacioGaratge(){
    const preuFonSot = 650;
    const preuFonPla = 290;
    if (Number(props.metres_garatge_soterrat) > 0){
      return Number(props.metres_garatge_soterrat) * preuFonSot;
    }
    else{
      return Number(props.metres_garatge_planta) * preuFonPla;
    }
  }

  function calculateTotalFonamentacio(iva?: String){
    const preuEscomeses = calculateEscomeses();
    const preuFon = 170;
    const preuFonSot = 650;
    const preuFonPla = 290;
    const valorIVA = 0.10;
    if (iva === "iva") {
      if (Number(props.metres_garatge_soterrat) > 0)
      {
        const calcul = ((Number(props.metres_a_construir) * preuFon) + (Number(props.metres_garatge_soterrat) * preuFonSot) + preuEscomeses ) * valorIVA;
        return calcul;
      }
      else{
        if (Number(props.metres_garatge_planta) > 0)
        {
          const calcul = ( (Number(props.metres_a_construir) * preuFon) + (Number(props.metres_garatge_planta) * preuFonPla) + preuEscomeses ) * valorIVA;
          return calcul;
        }
      }
    } else{
      if (Number(props.metres_garatge_soterrat) > 0)
      {
        const calcul = ( (Number(props.metres_a_construir) * preuFon) + (Number(props.metres_garatge_soterrat) * preuFonSot) + preuEscomeses );
        return calcul;
      }
      else{
        if (Number(props.metres_garatge_planta) > 0)
        {
          const calcul = ( (Number(props.metres_a_construir) * preuFon) + (Number(props.metres_garatge_planta) * preuFonPla) + preuEscomeses );
          return calcul;
        }
      }
    }
    
    
  }

  function calculateIVACostConstruccio(){
    const preuMetreQuadrat = 1200;
    const valorIVAConst = 0.10; // És 10% de IVA ja que és construcció
    return ((Number(props.metres_a_construir) * preuMetreQuadrat) + Number(props.metres_garatge_planta) * preuMetreQuadrat) * valorIVAConst;
  }

  function calculateIVAProjArq(){
    const preuMetreQuadratArq = 180;
    const valorIVAProjArq = 0.21; // És 21% de IVA ja que és un servei
    return Number(props.metres_a_construir) * preuMetreQuadratArq * valorIVAProjArq;
  }

  

  

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

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onSubmit={makePDFinvoice}
    >
    <div id="wholeDiv" style ={{background: "white"}}>
      <div id="logoDiv" style ={{background: "white"}}>
          {/*
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#016B66" }}>
            {" "}
            Pressupost I'm in
          </h1>
          */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Item elevation={0}>
              <Box sx={{m: 1, color: "#016B66" }} fontSize="40px" >Pressupost I'm in</Box>
              <Box sx={{ fontSize: 16, m: 1, fontWeight: "light" }}>CONSTRUCCIÓ D'UN HABITATGE I'M IN. Preus amb impostos inclosos a part.</Box>
            </Item>
          </Grid>
          <Grid item xs={2}>
            <ItemLogo elevation={0}>
              <Box>
              <img src={require('../img/logo_imini.png')} alt="logo" className={classes.logo} />
              </Box>
            </ItemLogo>
          </Grid>
        </Grid>
      </div>
      <div id="divToPrint" style ={{background: "white"}}>  
      
      <TableContainer>
      <Table className={classes.table} >
        <TableHead>
          <TableRow >
            <TableCell> <Box fontWeight="fontWeightBold" m={1} color="#016B66" > Cost Construcció Casa Passiva </Box> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row"> 
                Metres quadrats -- {props.metres_a_construir} metres
              </TableCell>
              <TableCell align="right">{props.metres_a_construir} m² </TableCell>
              <TableCell align="right">{Number(props.metres_a_construir) * 1200} €</TableCell>
             
            </TableRow>
            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Garatge { (Number(props.metres_garatge_soterrat) > 0) ? "soterrat" : "en planta" } (m²)
              </TableCell>
              <TableCell align="right">{ (Number(props.metres_garatge_soterrat) > 0) ? props.metres_garatge_soterrat : props.metres_garatge_planta }  m² </TableCell>
              <TableCell align="right">{ (Number(props.metres_garatge_soterrat) > 0) ? Number(props.metres_garatge_soterrat) * 1200 : Number(props.metres_garatge_planta) * 1200 } €</TableCell>
             
            </TableRow>

            <TableRow key="habitacions">
              <TableCell component="th" scope="row">
                Habitacions
              </TableCell>
              <TableCell align="right"> {props.habitacions}  </TableCell>
              <TableCell align="right">   </TableCell>
             
            </TableRow>

            <TableRow key="banys">
              <TableCell component="th" scope="row">
                Banys
              </TableCell>
              <TableCell align="right"> {props.banys} </TableCell>
              <TableCell align="right">  </TableCell>
             
            </TableRow>

            <TableRow key="preuc">
              <TableCell component="th" scope="row">
                <Box fontWeight="fontWeightBold" m={1} color="#016B66"> Total de la construcció </Box>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"> {calculateTotalConstruction()} €</TableCell>
             
            </TableRow>
         
        </TableBody>
      </Table>

      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Box fontWeight="fontWeightBold" m={1} color="#016B66"> 
                Honoraris projecte arquitectònic 
              </Box>
              <Box fontWeight="fontWeightLight" m={1} color="#016B66"> 
                (En cas que hagis indicat que ja tens arquitecte propi, el valor serà 0€) 
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row">
                Metres quadrats
              </TableCell>
              <TableCell align="right"> {props.metres_a_construir} m² </TableCell>
              <TableCell align="right">  </TableCell>
             
            </TableRow>
            <TableRow key="tipusestructura">
              <TableCell component="th" scope="row">
                Tipus estructura
              </TableCell>
              <TableCell align="right"> Casa passiva </TableCell>
              <TableCell align="right">   </TableCell>
            </TableRow>

            <TableRow key="totalprojectearq">
              <TableCell component="th" scope="row">
                <Box fontWeight="fontWeightBold" m={1} color="#016B66"> Total projecte arquitectònic i direcció d'obra: </Box>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"> {calculateTotalProjArq()} €</TableCell>
             
            </TableRow>
         
        </TableBody>
      </Table>

      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><Box fontWeight="fontWeightBold" m={1} color="#016B66"> Fonamentació </Box> </TableCell>
      
            
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row">
                Plantes
              </TableCell>
              <TableCell align="right"> {props.plantes} </TableCell>
              <TableCell align="right">  </TableCell>
             
            </TableRow>
            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Metres quadrats
              </TableCell>
              <TableCell align="right"> {props.metres_a_construir} m² </TableCell>
              <TableCell align="right"> {Number(props.metres_a_construir) * 170} €  </TableCell>
            </TableRow>

            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Garatge { (Number(props.metres_garatge_soterrat) > 0) ? "soterrat" : "en planta" } (m²)
              </TableCell>
              <TableCell align="right">{ (Number(props.metres_garatge_soterrat) > 0) ? props.metres_garatge_soterrat : props.metres_garatge_planta } m² </TableCell>
              <TableCell align="right">{CalculateFonamentacioGaratge()} €  </TableCell>
            </TableRow>

            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Banys
              </TableCell>
              <TableCell align="right"> {props.banys} </TableCell>
              <TableCell align="right">    </TableCell>
            </TableRow>

            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Escomeses
              </TableCell>
              <TableCell align="right"> </TableCell>
              <TableCell align="right">  {calculateEscomeses()} €  </TableCell>
            </TableRow>

            <TableRow key="preuc">
              <TableCell component="th" scope="row">
                <Box fontWeight="fontWeightBold" m={1} color="#016B66">Total fonamentació </Box>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">{ calculateTotalFonamentacio() } €</TableCell>
            </TableRow>
         
        </TableBody>
      </Table>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><Box fontWeight="fontWeightBold" m={1} color="#016B66"> Impostos </Box> </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row">
                <Box> IVA (de Cost Construcció Casa) </Box>
              </TableCell>
              <TableCell align="right">10% </TableCell>
              <TableCell align="right"> {calculateIVACostConstruccio()} €  </TableCell>
            </TableRow>
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row">
              <Box> IVA (de Honoraris projecte arquitectònic) </Box>
              </TableCell>
              <TableCell align="right">21% </TableCell>
              <TableCell align="right"> {calculateIVAProjArq()} €  </TableCell>
            </TableRow>
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row">
              <Box> IVA (de Fonamentació) </Box>
              </TableCell>
              <TableCell align="right">10% </TableCell>
              <TableCell align="right">  {calculateTotalFonamentacio("iva")} €  </TableCell>
            </TableRow>
            <TableRow key="garatge">
              <TableCell component="th" scope="row">
              <Box> Llicència d'obres (Xifra aproximada, a cada municipi és diferent) </Box>
              </TableCell>
              <TableCell align="right"> 4% </TableCell>
              <TableCell align="right">  preguntar sobre quin import € </TableCell>
             
            </TableRow>

            <TableRow key="preuc">
              <TableCell component="th" scope="row">
                <Box fontWeight="fontWeightBold" m={1} color="#016B66" >Total impostos: </Box>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"> {calculateIVACostConstruccio() + calculateIVAProjArq() + Number(calculateTotalFonamentacio("iva")) } €</TableCell>
             
            </TableRow>
         
        </TableBody>
      </Table>

      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><Box fontWeight="fontWeightBold" m={3} color="#016B66"> TOTAL </Box> </TableCell>
            <TableCell align="right"><Box fontWeight="fontWeightBold" m={1}> {Number(calculateTotalConstruction()) + Number(calculateTotalProjArq()) + Number(calculateTotalFonamentacio()) + (calculateIVACostConstruccio() + calculateIVAProjArq() + Number(calculateTotalFonamentacio("iva"))) } € </Box> </TableCell>
          </TableRow>
        </TableHead>
        
      </Table>

    </TableContainer>
    </div>
    <Divider variant="fullWidth" orientation="horizontal" flexItem />
    <Divider variant="fullWidth" orientation="horizontal" flexItem />
    <Box id="condicions_de_contratacion" sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Item elevation={0}><Box sx={{mt: 10, m: 1, color: "#016B66" }} fontSize="20px" >Condiciones de contratación</Box> </Item>
        </Grid>
        <Grid item xs={4}>
          <Item elevation={0}> </Item>
        </Grid>
        <Grid item xs={4}>
          <Item elevation={0}> <Box sx={{ color:"black" }} fontSize="15px" >Este presupuesto incluye:</Box> </Item>
        </Grid>
        <Grid item xs={8}>
          <Item elevation={0}> </Item>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Diseño arquitectónico: anteproyecto, proyecto básico y proyecto de ejecución. </ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Interiorismo y paisajismo estándar.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Trámites administrativos para obtener la licencia de obras.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Dirección y supervisión de obras.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Estudio básico de seguridad y salud.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Aislamiento térmico de acuerdo al estándar Passivhaus.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Acabados: piso, baño, cocina, persianas.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Instalación de servicios básicos: electricidad, agua, gas, telecomunicaciones.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Certificado final de obra.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Certificado de eficiencia energética.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Cédula de habitabilidad.</ItemTip>
        </Grid>
        <Grid item xs={4}>
          <Item elevation={0}> <Box sx={{ color:"black" }} fontSize="15px">Este presupuesto NO incluye:</Box> </Item>
        </Grid>
        <Grid item xs={8}>
          <Item elevation={0}></Item>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Tasa de licencia de obras. </ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Estudio topográfico.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Movimiento de tierra y colocación de cimientos.</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Paisajismo personalizado (opcional).</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Interiorismo personalizado (opcional).</ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Certificado Passivhaus (opcional).</ItemTip>
        </Grid>
        <Grid item xs={4}>
          <Item elevation={0}> <Box sx={{ color:"black" }} fontSize="15px">Modalidad de pago:</Box> </Item>
        </Grid>
        <Grid item xs={8}>
          <Item elevation={0}></Item>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Para trabajar en el anteproyecto es necesario un abono inicial de 2.500 € </ItemTip>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· Posteriormente, se harán abonos mensuales en función de la duración del proyecto.</ItemTip>
        </Grid>
        <Grid item xs={4}>
          <Item elevation={0}> <Box sx={{ color:"black" }} fontSize="15px">Observaciones:</Box> </Item>
        </Grid>
        <Grid item xs={8}>
          <Item elevation={0}></Item>
        </Grid>
        <Grid item xs={12}>
          <ItemTip elevation={0}>· El presente presupuesto es orientativo. </ItemTip>
        </Grid>
      </Grid>
    </Box>
    </div>    
    

      <Button
        variant="contained"
        color="primary"
        size="large"
        type="submit"
        disabled={loading}
      >
        {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
        Descargar en PDF
      </Button>
      <DLink to="/signup">make an account &rarr;</DLink>
    </form>
  );
};

export default Quote;
function metres_a_construir(arg0: string, metres_a_construir: any) {
  throw new Error("Function not implemented.");
}

