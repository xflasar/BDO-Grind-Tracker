import React, { useContext, useEffect, useReducer } from 'react'
import '../../../../../../assets/pages/UserControlPanel/ProfileSettings/ProfileSettings.scss'
import { SessionContext } from '../../../../../../contexts/SessionContext'
import { INITIAL_STATE, profileSettingsReducer } from './profileSettingsReducer'

const ProfileSettings = () => {
  const { isSignedIn, authorizedFetch } = useContext(SessionContext)
  const [state, dispatch] = useReducer(profileSettingsReducer, INITIAL_STATE)

  async function FetchUserData () {
    const response = await authorizedFetch('api/user/usersettingsdata')
    const data = await response.json()
    if (data) {
      dispatch({ type: 'PROFILE_SETTINGS_UPDATE_FETCH', payload: data })
    }
  }

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/'
      return
    }

    if (!state.userSettings) {
      FetchUserData()
    }
  }, [isSignedIn, state.userSettings])

  const handleRegionServerChange = (e) => {
    dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: e.target.name, value: e.target.value } })
  }

  const handleValuePackChange = (e) => {
    const invertState = !state.valuePack
    dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: e.target.getAttribute('name'), value: invertState } })
  }

  const handleMerchantRingChange = (e) => {
    const invertState = !state.merchantRing
    dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: e.target.getAttribute('name'), value: invertState } })
  }

  const handleFamilyFameDropRate = (e) => {
    const invertState = !state.familyFameDropRate
    dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: e.target.getAttribute('name'), value: invertState } })
  }

  const handleFamilyFameChange = (e) => {
    let tempFamilyFame = e.target.value.trim()

    if (tempFamilyFame === '' || isNaN(tempFamilyFame)) {
      tempFamilyFame = 0
    } else {
      tempFamilyFame = parseInt(tempFamilyFame, 10)

      if (isNaN(tempFamilyFame)) {
        tempFamilyFame = 0
      }
    }

    if (tempFamilyFame >= 7000 && !state.familyFameDropRate) {
      dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: 'familyFameDropRate', value: true } })
    } else if (state.familyFameDropRate && tempFamilyFame < 7000) {
      dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: 'familyFameDropRate', value: false } })
    }

    dispatch({ type: 'PROFILE_SETTINGS_INPUT_CHANGE', payload: { name: e.target.name, value: tempFamilyFame } })
  }

  async function SaveSettingsData (e) {
    e.preventDefault()
    const regionServer = state.regionServer
    const valuePack = state.valuePack
    const merchantRing = state.merchantRing
    const familyFame = state.familyFame
    const familyFameDropRate = state.familyFameDropRate

    const response = await authorizedFetch('api/user/setusersettingsdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        regionServer,
        valuePack,
        merchantRing,
        familyFame,
        familyFameDropRate
      })
    })
    if (response.ok) {
      const data = await response.json()
      dispatch({ type: 'PROFILE_SETTINGS_UPDATE_FETCH', payload: data })
    } else {
      console.log('Failed to save settings data')
    }
  }

  return (
        <div aria-label='profileSettings-container' className='profileSettings-container'>
            <h2>Profile settings</h2>
            {state.userSettings
              ? (
            <form aria-label='profileSettings-container-form'>
                <div className='profileSettings-container-form-inputlabel'>
                  <h2>Region and Localization</h2>
                  <div className='delimiter' />
                  <div className='regionLocalization'>
                    <div className='regionLocalization-region'>
                      <label htmlFor='region'>Region</label>
                      {/* add dropdown menu for region and add localization */}
                      <input type='text' id='region' name='region' placeholder='Region' value={state.regionServer} onChange={handleRegionServerChange} />
                    </div>
                  </div>
                  <h2 htmlFor='grindingPreference'>Tax</h2>
                  <div className='delimiter' />
                  <div className='profileSettings-container-form-inputlabel-grindingPreference'>
                    <div className='leftSide'>
                      <div className='holderBox'>
                        <label htmlFor='valuePack'>Value Pack</label>
                        <div className='buttonHolder' id='valuePack' name='valuePack' onClick={(e) => handleValuePackChange(e)}>
                          <div className={state.valuePack ? 'buttonActive' : ''} name='valuePack'>Yes</div>
                          <div className={!state.valuePack ? 'buttonInactive' : ''} name='valuePack'>No</div>
                        </div>
                      </div>

                      <div className='holderBox'>
                        <label htmlFor='merchantRing'>Merchant Ring</label>
                        <div className='buttonHolder' id='merchantRing' name='merchantRing' onClick={(e) => handleMerchantRingChange(e)}>
                          <div className={state.merchantRing ? 'buttonActive' : ''} name='merchantRing'>Yes</div>
                          <div className={!state.merchantRing ? 'buttonInactive' : ''} name='merchantRing'>No</div>
                        </div>
                      </div>
                    </div>

                    <div className='tax'>
                      <label htmlFor='tax'>Tax</label>
                      <div className='profileSettings-container-form-inputlabel-tax'>
                        <input type='text' className='profileSettings-container-form-inputlabel-tax-total' disabled value={((1 + state.tax) * 100).toFixed(2) + '%'} />
                        <div className='profileSettings-container-form-inputlabel-tax-deliminator'>|</div>
                        <input type='text' className='profileSettings-container-form-inputlabel-tax-taxed' disabled value={state.tax * 100 + '%'} />
                      </div>
                    </div>

                    <div className='rightSide'>
                      <div className='holderBox'>
                      <label htmlFor='familyFame'>Family Fame</label>
                        <input type='text' id='familyFame' name='familyFame' pattern='[0-9.]+' value={state.familyFame} onChange={handleFamilyFameChange}/>
                      </div>

                      <div className='holderBox'>
                        <label htmlFor='familyFameDropRate'>Family fame 7000+</label>
                        <div className='buttonHolder' id='familyFameDropRate' name='familyFameDropRate' onClick={(e) => handleFamilyFameDropRate(e)}>
                          <div className={state.familyFameDropRate ? 'buttonActive' : ''} name='familyFameDropRate'>Yes</div>
                          <div className={!state.familyFameDropRate ? 'buttonInactive' : ''} name='familyFameDropRate'>No</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button id='profileSettingsSaveButton' name='profileSettingsSaveButton' onClick={SaveSettingsData}>Save</button>
            </form>)
              : (<h1>UserSettings not available</h1>)}
        </div>
  )
}

export default ProfileSettings
