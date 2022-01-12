import React, { useState, useEffect } from 'react';
import Slide from '@mui/material/Slide';
import { DialogTitle, Dialog, DialogContent } from '@mui/material';
import DialogStyles from './DialogStyles';
import WizardHeader from '../header/WizardHeader';
import NewWallet from '../NewWallet';
import LandingDialogue from './LandingDialogue';
import Login from '../login/Login';
import Final from '../stuff/Final';
import ExistingWallet from '../Existing/wallet/ExistingWallet';
import Test1 from '../Existing/wallet/Test1';
import Test2 from '../Existing/wallet/Test2';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MainDialogue = ({ open, handleClose, activeExisting }) => {
  const styles = DialogStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [activeStepWhileExisting, setActiveStepWhileExisting] = useState(0);

  // while existing

  // normal
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    
  };

  useEffect(() => {
    console.log(activeStep, 'active');
  }, [activeStep]);
  useEffect(()=>{
    console.log(activeExisting,"hail")
  },[activeExisting])
  return (
    <div>
      <Dialog
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            backgroundColor: '#222222',
            padding: '0px 1rem 1rem 1rem',
            borderRadius: 10,
          },
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <WizardHeader
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </DialogContent>
        {activeExisting===true&&activeStep===0 &&<ExistingWallet /> }
        {activeExisting===true&&activeStep===1 &&<Login /> }
        {activeExisting===false&&activeStep===0 &&<NewWallet /> }
        {activeExisting===false&&activeStep===1 &&<Login /> }
        {activeStep===2 &&<Final /> }
      </Dialog>
    </div>
  );
};

export default MainDialogue;
