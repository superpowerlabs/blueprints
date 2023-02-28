/* eslint-disable */
// eslint-disable-next-line no-undef
import React from "react";
import { Modal, Button } from "react-bootstrap";
import Base from "./Base";

export default class PopUp extends Base {
  constructor(props) {
    super(props);
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
      show,
    } = this.props.modals;

    return (
      <div>
        <Modal
          show={show}
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
      </div>
    );
  }
}
