import React, { Children, Component } from 'react'
import { createPortal } from 'react-dom'

export class IFrame extends Component {
  constructor(props) {
    super(props)
    this.setContentRef = node => {
      this.contentRef = node?.contentWindow?.document.body
    }
  }

  render() {
    const { children, ...props } = this.props
    return (
      <iframe {...props} ref={this.setContentRef}>
        {this.contentRef &&
          createPortal(
            Children.only(children),
            this.contentRef
          )}
      </iframe>
    )
  }
}