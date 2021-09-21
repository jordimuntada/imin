import React from "react";
import TextField from "@material-ui/core/TextField";
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { styled } from "@material-ui/core/styles";
import { useInput } from "./../utils/forms";
import { useInputCheckbox } from "./../utils/forms";
import { Toast } from "./../utils/notifications";
import { Auth } from "aws-amplify";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link, useHistory } from "react-router-dom";

const Field = styled(TextField)({
  margin: "10px 0",
});

const DLink = styled(Link)({
  margin: "15px 0",
  textAlign: "right",
});

const Signup: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  
  /*const [state, setState] = React.useState({
    checked: false
  });*/

  /*const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Inside handleChange");
    setState({ ...state, [event.target.name]: event.target.checked });

  };*/

  const history = useHistory();

  const { value: name, bind: bindName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: phone, bind: bindPhone } = useInput("");
  const { value: city, bind: bindCity } = useInput("");
  const { value: iamarchitect, bind: bindIAmArchitect } = useInputCheckbox(false);
  const { value: password, bind: bindPassword } = useInput("");
  const { value: confirmPassword, bind: bindConfirmPassword } = useInput("");

  //const [checked, setChecked] = React.useState(false);

  /*const toggleChecked = () => {
    setChecked((prev) => !prev);
  };*/


  const handleSignUp = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

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
    setLoading(false);
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onSubmit={handleSignUp}
    >
      <h1 style={{ fontSize: "22px", fontWeight: 800 }}>
        {" "}
        Hacerme una cuenta
      </h1>
      <Field label="Name" {...bindName} />
      <Field label="Email" {...bindEmail} type="email" />
      <Field label="Phone" {...bindPhone} type="tel" />
      <Field label="City" {...bindCity} />
      <FormGroup>
      <FormControlLabel
        control={<Switch checked={iamarchitect} name="checked" {...bindIAmArchitect}         
        />}
        label="Soy arquitecta/o"
      />
      </FormGroup>
      <Field label="Password" type="password" {...bindPassword} />
      <Field
        label="Confirm Password"
        type="password"
        {...bindConfirmPassword}
      />
      <Button
        variant="contained"
        color="primary"
        size="large"
        type="submit"
        disabled={loading}
      >
        {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
        Sign Up
      </Button>
      <DLink to="/signin">go to login &rarr;</DLink>
    </form>
  );
};

export default Signup;
