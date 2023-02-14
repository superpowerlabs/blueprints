import * as React from "react";
import { Box, Modal, Button, CircularProgress } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
// import { Web3Context } from "../../contexts/Web3Context";
// import { SaleContext } from "../../contexts/SaleContext";
import { isValidAddress } from "ethereumjs-util";
import PropTypes from "prop-types";

TransferModal.propTypes = {
  show: PropTypes.bool.isRequired,
  id: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function TransferModal(props) {
  //   let { web3NetworkDetails } = React.useContext(Web3Context);
  //   const { connectedWallet } = web3NetworkDetails;
  //   const { safeTransfer } = React.useContext(SaleContext);
  const [waiting, setWaiting] = React.useState(false);
  const [wallet, setWallet] = React.useState("");
  const [working, setWorking] = React.useState(false);

  function handleCodeChange(event) {
    setWallet(event.target.value);
  }

  async function transferNow() {
    setWorking(true);
    setWaiting(true);
    // const tx = await safeTransfer(web3NetworkDetails, props.id[0], wallet);
    // if (!tx) {
    //   setWorking(false);
    //   setWallet("");
    // } else {
    //   props.onClose(true);
    //   setWaiting(false);
    //   setWallet("");
    // }
  }

  function isWalletNotValid() {
    return !isValidAddress(wallet);
  }

  const handleClose = () => {
    props.onClose();
  };
  return (
    <Modal
      open={props.show}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={"transfer-modal"}>
        {!waiting ? (
          <div>
            <div className={"basic-title center bold"}>
              Transfer #{props.id[0]}
            </div>
            <div className={"basic-body center"}>
              <div>
                <img
                  src={props.id[1]}
                  className="modalImage"
                  alt="icon"
                  style={{ marginLeft: 100, marginTop: "-10%" }}
                />
                <div>
                  <input
                    type="text"
                    placeholder="Paste address here"
                    onChange={handleCodeChange}
                    className="inputTransfer"
                  />
                </div>
                <div className="transferButton">
                  {" "}
                  <Button
                    disabled={isWalletNotValid(wallet)}
                    className={"button transfer"}
                    variant="outlined"
                    onClick={() => transferNow()}
                  >
                    Transfer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : working ? (
          <div>
            <div className={"basic-title center bold"}>
              Waiting for confirmation
            </div>
            <div className={"basic-body center"}>
              <CircularProgress />
            </div>
          </div>
        ) : (
          <div>
            <div className={"basic-title center bold error"}>
              Transaction error
            </div>
            <div className={"basic-body center"}>
              <ErrorIcon sx={{ color: "red", fontSize: 50 }} />
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );
}
