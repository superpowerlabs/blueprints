import * as React from "react";
import { Box, Modal, Button, CircularProgress } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { isValidAddress } from "ethereumjs-util";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Base from "./Base";

export default class TransferModal extends Base {
  constructor(props) {
    super(props);

    this.state = {
      wallet: "",
      working: 0,
      message: "",
      error: "",
      contracts: this.Store.contracts.SynCityCoupons,
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
    const owner = await this.state.contracts["ownerOf(uint256)"](
      this.props.id[0]
    );
    if (owner === this.Store.connectedWallet) {
      this.setState({ working: 1 });
      try {
        this.setState({
          message: (
            <span>
              Calling your wallet
              <br />
              to authorize the transaction
            </span>
          ),
        });
        /* eslint-disable */
        const tx = await this.state.contracts
          .connect(this.Store.signer)
          ["safeTransferFrom(address,address,uint256)"](
            this.Store.connectedWallet,
            this.state.wallet,
            this.props.id[0]
          );
        await tx.wait();
        for (let i = 0; i < this.Store.ownedIds.length; i++) {
          if (this.Store.ownedIds[i] === this.props.id[0]) {
            this.Store.ownedIds.splice(i, 1);
            break;
          }
        }
        this.setState({ message: "Transfer successful" });
        this.setState({ working: 2 });
      } catch (e) {
        this.setState({ working: 0 });
        this.setState({ error: e.message });
      }
    } else {
      this.setState({ working: 0 });
      this.setState({ error: "You are not the owner of the wallet" });
    }
  }

  isWalletNotValid(wallet) {
    return !isValidAddress(wallet) || wallet === this.Store.connectedWallet;
  }

  handleClose(event, reason) {
    if (reason !== "backdropClick") {
      if (this.state.working === 2) {
        this.props.onClose(true, this.props.id[0]);
      } else if (this.state.working === 0) {
        this.props.onClose(false, this.props.id[0]);
      }
    }
  }

  render() {
    const closeButton = (
      <div
        className={"floatRight"}
        style={{ color: "darkgray", margin: "5px -17px 0" }}
      >
        <HighlightOffIcon
          style={{ cursor: "pointer" }}
          onClick={this.handleClose}
        />
      </div>
    );
    return (
      <Modal
        open={this.props.show}
        onClose={this.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={"transfer-modal"}>
          {this.state.error ? (
            <div>
              {closeButton}
              <div className={"basic-title centered bold error"}>
                <ErrorIcon sx={{ color: "red", fontSize: 50 }} />
              </div>
              <div className={"basic-body center"}>
                <div className={"smallError"}>{this.state.error}</div>
              </div>
            </div>
          ) : this.state.working ? (
            <div>
              {this.state.working === 2 ? closeButton : null}
              <div className={"basic-title centered bold"}>
                {this.state.message}
              </div>
              <div className={"basic-body centered"}>
                {this.state.working === 1 ? (
                  <CircularProgress />
                ) : (
                  <span className={"light"}>Please, close this dialogue</span>
                )}
              </div>
            </div>
          ) : (
            <React.Fragment>
              <div className={"basic-title centered bold"}>
                Transfer #{this.props.id[0]}
              </div>
              <div className={"basic-body center"}>
                <div>
                  <img
                    src={this.props.id[1]}
                    className="modalImage"
                    alt="icon"
                    style={{ marginLeft: 125, paddingBottom: 20 }}
                  />
                  <div className="parentInput">
                    <input
                      type="text"
                      placeholder="Paste address here"
                      onChange={this.handleCodeChange}
                      className="inputTransfer"
                    />
                  </div>
                  <div className="buttons">
                    <div className="transferButton">
                      <Button
                        disabled={this.isWalletNotValid(this.state.wallet)}
                        className={"button transfer"}
                        variant="outlined"
                        onClick={() => this.transferNow()}
                      >
                        <div className="buttonText">Transfer</div>
                      </Button>
                    </div>
                    <div className="closeButton">
                      <Button
                        className={"button transfer"}
                        variant="outlined"
                        onClick={() => this.handleClose()}
                      >
                        <div className="buttonText">Cancel</div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </Box>
      </Modal>
    );
  }
}
