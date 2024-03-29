import React from 'react'
import '../../../../assets/components/ui/Homepage/HomepageBox.scss'
import PropTypes from 'prop-types'

class Box extends React.Component {
  render () {
    return (
      <div className={'box'}>
          <div className="box-title">{this.props.data.Title}</div>
          <div className="box-content">
              <p>
                  {this.props.data.Content}
              </p>
          </div>
      </div>
    )
  }
}
Box.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
}
export default Box
