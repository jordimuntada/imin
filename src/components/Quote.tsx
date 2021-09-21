import React from "react";
import CSS from "csstype";
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
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


//CSS
require('./css/invoice.css');

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Field = styled(TextField)({
  margin: "10px 0",
});

const DLink = styled(Link)({
  margin: "15px 0",
  textAlign: "right",
});

const Quote: React.FC <QuoteProperties> = (props) => {
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

  const classes = useStyles();

  const { value: email, bind: bindEmail } = useInput("");
  const { value: code, bind: bindCode } = useInput("");
  const { value: metros_cuadrados_construidos, bind: bindMetrosCuadradosConstruidos } = useInput("");

  const makePDFinvoice = async (e: React.SyntheticEvent<Element, Event>) => {
      e.preventDefault();
      setLoading(true);
      

      const input = document.getElementById('divToPrint') as HTMLCanvasElement;
      console.log("input ---->", input);
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          pdf.addImage(imgData, 'JPEG', 0, 0, 0, 0);
          // pdf.output('dataurlnewwindow');
          pdf.save("download.pdf");
        });
        

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
    <div id="divToPrint">
      <h1 style={{ fontSize: "22px", fontWeight: 800 }}>
        {" "}
        AIXÓ ÉS EL TEU PRESSUPOST
      </h1>

      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell> <Box fontWeight="fontWeightBold" m={1}> Cost Construcció Casa Passiva </Box> </TableCell>
      
            
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row">
                Metres quadrats
              </TableCell>
              <TableCell align="right">{props.metres_a_construir} m² </TableCell>
              <TableCell align="right">{Number(props.metres_a_construir) * 1450} €</TableCell>
             
            </TableRow>
            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Garatge {Number(props.metres_garatge_planta) > 0 ? "en planta" : "soterrat" }
 planta (m²)
              </TableCell>
              <TableCell align="right">{props.metres_garatge_planta} m² </TableCell>
              <TableCell align="right">{Number(props.metres_garatge_planta)} €</TableCell>
             
            </TableRow>

            <TableRow key="habitacions">
              <TableCell component="th" scope="row">
                Habitacions
              </TableCell>
              <TableCell align="right"> 3  </TableCell>
              <TableCell align="right">   </TableCell>
             
            </TableRow>

            <TableRow key="banys">
              <TableCell component="th" scope="row">
                Banys
              </TableCell>
              <TableCell align="right">4 </TableCell>
              <TableCell align="right">  </TableCell>
             
            </TableRow>

            <TableRow key="preuc">
              <TableCell component="th" scope="row">
                <Box fontWeight="fontWeightBold" m={1}> Total de la construcció </Box>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">346.500€</TableCell>
             
            </TableRow>
         
        </TableBody>
      </Table>

      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><Box fontWeight="fontWeightBold" m={1}> Honoraris projecte arquitectònic (En cas que hagis indicat que ja tens arquitecte propi, el valor serà 0€) </Box> </TableCell>
      
            
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row">
                Metres quadrats
              </TableCell>
              <TableCell align="right">330 m² </TableCell>
              <TableCell align="right">  </TableCell>
             
            </TableRow>
            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Tipus estructura
              </TableCell>
              <TableCell align="right">Casa passiva </TableCell>
              <TableCell align="right">   </TableCell>
             
            </TableRow>

            

            <TableRow key="preuc">
              <TableCell component="th" scope="row">
                <Box fontWeight="fontWeightBold" m={1}>Total projecte arquitectònic i direcció d'obra: </Box>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">0 €</TableCell>
             
            </TableRow>
         
        </TableBody>
      </Table>

      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><Box fontWeight="fontWeightBold" m={1}> Fonamentació </Box> </TableCell>
      
            
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row">
                Plantes
              </TableCell>
              <TableCell align="right">2</TableCell>
              <TableCell align="right">  </TableCell>
             
            </TableRow>
            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Metres quadrats
              </TableCell>
              <TableCell align="right">330 m² </TableCell>
              <TableCell align="right"> 33333 €  </TableCell>
            </TableRow>

            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Garatge soterrat (m²)
              </TableCell>
              <TableCell align="right">20 m² </TableCell>
              <TableCell align="right"> 13.200 €  </TableCell>
            </TableRow>

            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Banys
              </TableCell>
              <TableCell align="right">2 </TableCell>
              <TableCell align="right">    </TableCell>
            </TableRow>

            <TableRow key="garatge">
              <TableCell component="th" scope="row">
                Escomeses
              </TableCell>
              <TableCell align="right"> </TableCell>
              <TableCell align="right">  8.500 €  </TableCell>
            </TableRow>

            <TableRow key="preuc">
              <TableCell component="th" scope="row">
                <Box fontWeight="fontWeightBold" m={1}>Total fonamentació </Box>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">76.150 €</TableCell>
             
            </TableRow>
         
        </TableBody>
      </Table>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><Box fontWeight="fontWeightBold" m={1}> Impostos </Box> </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow key="metresquadrats">
              <TableCell component="th" scope="row">
                IVA
              </TableCell>
              <TableCell align="right">10% </TableCell>
              <TableCell align="right"> 34.650€ </TableCell>
             
            </TableRow>
            <TableRow key="garatge">
              <TableCell component="th" scope="row">
               Llicència d'obres (Xifra aproximada, a cada municipi és diferent)
              </TableCell>
              <TableCell align="right"> 4% </TableCell>
              <TableCell align="right">  16.378€ </TableCell>
             
            </TableRow>

            <TableRow key="preuc">
              <TableCell component="th" scope="row">
                <Box fontWeight="fontWeightBold" m={1}>Total impostos: </Box>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">51.028€</TableCell>
             
            </TableRow>
         
        </TableBody>
      </Table>

      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><Box fontWeight="fontWeightBold" m={3}> TOTAL </Box> </TableCell>
            <TableCell align="right"><Box fontWeight="fontWeightBold" m={1}> 473.678€ </Box> </TableCell>
          </TableRow>
        </TableHead>
        
      </Table>

    </TableContainer>
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

