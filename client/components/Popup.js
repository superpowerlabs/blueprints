/* eslint-disable */
// eslint-disable-next-line no-undef
import React from "react";
import { Modal, Button } from "react-bootstrap";
import Base from "./Base";
import TransferModal from "./TransferModal";

export default class PopUp extends Base {
  constructor(props) {
    super(props);

    this.state = { show: false, id: [props.modals.id, props.modals.image] };

    this.bindMany(["handleClose", "showTransfer"]);
  }

  handleClose() {
    this.setState({ show: false });
  }

  showTransfer() {
    this.setState({ show: true });
  }
  render() {
    const {
      title,
      body,
      size,
      closeLabel,
      saveLabel,
      noClose,
      handleClose,
      handleSave,
      backdrop,
      dialogClassName,
      centered,
      noSave,
      extra,
      handleExtra,
      footerText,
      closeVariant,
      saveVariant,
      extraVariant,
      store,
    } = this.props.modals;

    return (
      <div>
        <Modal
          show={this.state.show ? false : true}
          onHide={handleClose}
          size={size}
          autoFocus
          backdrop={backdrop}
          dialogClassName={dialogClassName}
          aria-labelledby={
            centered ? "contained-modal-title-vcenter" : undefined
          }
          centered={centered || false}
        >
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{body}</Modal.Body>
          {noClose && noSave && !footerText && !extra ? (
            ""
          ) : (
            <Modal.Footer>
              {store.ownedIds.includes(this.state.id[0]) ? (
                <Button
                  variant={closeVariant || "secondary"}
                  onClick={this.showTransfer}
                >
                  Transfer
                </Button>
              ) : null}
              {footerText}
              {noClose ? (
                ""
              ) : (
                <Button
                  variant={closeVariant || "secondary"}
                  onClick={handleClose}
                >
                  {closeLabel || "Cancel"}
                </Button>
              )}
              {noSave ? (
                ""
              ) : (
                <Button variant={saveVariant || "primary"} onClick={handleSave}>
                  {saveLabel || "Ok"}
                </Button>
              )}
              {extra ? (
                <Button
                  variant={extraVariant || "primary"}
                  onClick={handleExtra}
                >
                  {extra}
                </Button>
              ) : (
                ""
              )}
            </Modal.Footer>
          )}
        </Modal>
        <TransferModal
          show={this.state.show}
          id={this.state.id}
          onClose={this.handleClose}
          store={store}
        />
      </div>
    );
  }
}
