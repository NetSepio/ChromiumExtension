import React, {  useEffect } from 'react';
import Slide from '@mui/material/Slide';
import { Dialog, DialogContent } from '@mui/material';
import DialogStyles from './DialogStyles';
import WizardHeader from '../header/WizardHeader';
import NewWallet from '../NewWallet';
import Login from '../login/Login';
import Final from '../stuff/Final';
import ExistingWallet from '../Existing/wallet/ExistingWallet';
import { useDispatch, useSelector } from 'react-redux';
import { updateStep } from '../../redux/projects/projectSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MainDialogue = ({ open, handleClose, activeExisting }) => {
  const dispatch = useDispatch();
  const styles = DialogStyles();
  const activeStep = useSelector((state) => state.project.activeStep);

  // while existing

  // normal
  const handleNext = () => {
    // dispatch(updateStep({ data: activeStep + 1 }));
  };

  const handleBack = () => {
    dispatch(updateStep({ data: activeStep - 1 }));
  };

  useEffect(() => {
    console.log(activeStep, 'active');
  }, [activeStep]);
  useEffect(() => {
    console.log(activeExisting, 'hail');
  }, [activeExisting]);
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
        <DialogContent style={{overflow:'hidden'}}>
          <WizardHeader
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </DialogContent>
        {activeExisting === true && activeStep === 0 && <ExistingWallet />}
        {activeExisting === true && activeStep === 1 && <Login />}
        {activeExisting === false && activeStep === 0 && <NewWallet />}
        {activeExisting === false && activeStep === 1 && <Login />}
        {activeStep === 2 && <Final />}
      </Dialog>
    </div>
  );
};

export default MainDialogue;
