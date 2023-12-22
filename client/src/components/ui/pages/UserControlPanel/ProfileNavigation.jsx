import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../../../../assets/components/ui/UserControlPanel/ProfileNavigation/ProfileNavigation.scss'

const ProfileNavigation = ({ navPage }) => {
  const [showMenu, setShowMenu] = useState(true)

  const handleProfileClick = () => {
    navPage('Profile')
  }
  const handleSecurityClick = () => {
    navPage('Security')
  }
  const handleSettingsClick = () => {
    navPage('Settings')
  }

  const handleShowHideMenu = () => {
    setShowMenu(!showMenu)
  }

  // Do I want to hide the whole
  return (
    <>
      <div aria-label='profileNavigation' className={showMenu ? 'profile-navigation-container' : 'profile-navigation-container deactivated'}>
        <nav aria-label='profilenavigationnav' className='profile-navigation-nav'>
          <ul>
            <li>
              <button aria-label='profileButton' onClick={() => handleProfileClick()}>Profile</button>
            </li>
            <li>
              <button aria-label='securityButton' onClick={() => handleSecurityClick()}>Security</button>
            </li>
            <li>
              <button aria-label='settingsButton' onClick={() => handleSettingsClick()}>Settings</button>
            </li>
          </ul>
        </nav>
      </div>
      <div className='profileNavigation-ShowHideBtn'>
        <button type='button' onClick={() => handleShowHideMenu()}>
          <div className='icon-holder'>
            {showMenu
              ? (
                <span className='close'>X</span>
                )
              : (
                <>
                  <span/><span/><span/>
                </>
                )
            }
          </div>
          </button>
      </div>
    </>
  )
}

ProfileNavigation.propTypes = {
  navPage: PropTypes.func.isRequired
}

export default ProfileNavigation
