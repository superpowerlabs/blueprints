const { Modal, Button } = ReactBootstrap;
// eslint-disable-next-line no-undef
export default class PopUp extends React.Component {

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
      extraVariant
    } = this.props.modals

    return <Modal show={true}
                  onHide={handleClose}
                  size={size}
                  autoFocus
                  backdrop={backdrop}
                  dialogClassName={dialogClassName}
                  aria-labelledby={centered ? 'contained-modal-title-vcenter' : undefined}
                  centered={centered || false}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      {
        noClose && noSave && !footerText && !extra
          ? ''
          : <Modal.Footer>
            {footerText}
            {
              noClose ? '' : <Button variant={closeVariant || 'secondary'} onClick={handleClose}>
                {closeLabel || 'Cancel'}
              </Button>
            }
            {
              noSave ? '' : <Button variant={saveVariant || 'primary'} onClick={handleSave}>
                {saveLabel || 'Ok'}
              </Button>
            }
            {
              extra ? <Button variant={extraVariant || 'primary'} onClick={handleExtra}>
                {extra}
              </Button> : ''
            }

          </Modal.Footer>
      }
    </Modal>
  }
}


