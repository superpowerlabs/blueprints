import * as React from "react";
import { Box, Modal, Button, CircularProgress } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { isValidAddress } from "ethereumjs-util";
import Base from "./Base";

export default class TransferModal extends Base {
  constructor(props) {
    super(props);

    this.state = {
      waiting: false,
      wallet: "",
      working: false,
    };

    this.bindMany([
      "handleCodeChange",
      "transferNow",
      "isWalletNotValid",
      "handleClose",
    ]);
  }

  handleCodeChange(event) {
    this.setState({ wallet: event.target.value });
  }

  async transferNow() {
    this.setState({ working: true });
    this.setState({ waiting: true });
  }

  isWalletNotValid() {
    return !isValidAddress(this.state.wallet);
  }

  handleClose() {
    this.props.onClose();
  }
  render() {
    return (
      <Modal
        open={this.props.show}
        onClose={this.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={"transfer-modal"}>
          {!this.state.waiting ? (
            <div>
              <div className={"basic-title center bold"}>
                Transfer #{this.props.id[0]}
              </div>
              <div className={"basic-body center"}>
                <div>
                  <img
                    src={this.props.id[1]}
                    className="modalImage"
                    alt="icon"
                    style={{ marginLeft: 125, paddingBottom: 22 }}
                  />
                  <div>
                    <input
                      type="text"
                      placeholder="Paste address here"
                      onChange={this.handleCodeChange}
                      className="inputTransfer"
                    />
                  </div>
                  <div className="transferButton">
                    {" "}
                    <Button
                      disabled={this.isWalletNotValid(this.state.wallet)}
                      className={"button transfer"}
                      variant="outlined"
                      onClick={() => this.transferNow()}
                    >
                      Transfer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : this.state.working ? (
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
}
