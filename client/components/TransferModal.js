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
      connectedWallet: this.props.store.connectedWallet,
      contracts: this.props.store.contracts.SynCityCoupons,
      signer: this.props.store.signer,
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
        .connect(this.state.signer)
        ["safeTransferFrom(address,address,uint256)"](
          this.state.connectedWallet,
          this.state.wallet,
          this.props.id[0]
        );
      await tx.wait();
      for (let i = 0; i < this.props.store.ownedIds.length; i++) {
        if (this.props.store.ownedIds[i] === this.props.id[0]) {
          this.props.store.ownedIds.splice(i, 1);
          break;
        }
      }
      console.log(this.props.store.ownedIds);
      this.setState({ message: "Transfer successful" });
      this.setState({ working: 2 });
    } catch (e) {
      this.setState({ working: 0 });
      this.setState({ error: e.message });
    }
  }

  isWalletNotValid(wallet) {
    return (
      !isValidAddress(this.state.wallet) ||
      wallet === this.props.store.connectedWallet
    );
  }

  handleClose() {
    if (this.state.working === 2) {
      this.props.onClose(true);
    } else {
      this.props.onClose(false);
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
                  <div>
                    <input
                      type="text"
                      placeholder="Paste address here"
                      onChange={this.handleCodeChange}
                      className="inputTransfer"
                    />
                  </div>
                  <div className="transferButton">
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
            </React.Fragment>
          )}
        </Box>
      </Modal>
    );
  }
}
