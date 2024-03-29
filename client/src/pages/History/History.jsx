import React, { useEffect, useContext, useReducer } from 'react'
import HistoryTable from '../../components/ui/pages/History/HistoryTable'
import EditSession from '../../components/form/EditSession/editSession'
import '../../assets/pages/History/History.scss'
import AddSession from '../../components/form/AddSession/addSession'
import { SessionContext } from '../../contexts/SessionContext'
import { INITIAL_STATE, historyReducer } from './historyReducer'

function History () {
  const { isSignedIn, authorizedFetch } = useContext(SessionContext)
  const [state, dispatch] = useReducer(historyReducer, INITIAL_STATE)

  async function fetchHistoryData () {
    try {
      const res = await authorizedFetch('api/user/historydata')
      const data = await res.json()
      return data
    } catch (error) {
      console.log('Failed to fetch history data:', error)
      return []
    }
  }

  useEffect(() => {
    if (!isSignedIn) {
      dispatch({ type: 'SET_HISTORY', payload: [] })
      return
    }

    fetchHistoryData()
      .then((data) => {
        if (data.message === 'No token provided!') {
          dispatch({ type: 'SET_HISTORY', payload: [] })
          return
        } else if (data.message === 'No sessions found!') {
          dispatch({ type: 'SET_HISTORY', payload: [] })
          return
        }
        dispatch({ type: 'SET_HISTORY', payload: data })
      })
      .catch(() => {
        dispatch({ type: 'SET_HISTORY', payload: [] })
      })
  }, [isSignedIn])

  function handleAddSession () {
    dispatch({ type: 'SHOW_ADD_SESSION' })
  }

  function handleEditSession (data) {
    if (state.showEditSession) {
      dispatch({ type: 'HIDE_EDIT_SESSION' })
      setTimeout(() => {
        dispatch({ type: 'HANDLE_SHOW_EDIT_SESSION', payload: data })
      }, 150)
    } else {
      dispatch({ type: 'HANDLE_SHOW_EDIT_SESSION', payload: data })
    }
  }

  async function handleDeleteSession (id) {
    try {
      const res = await authorizedFetch('api/user/deletesession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          SessionId: id
        })
      })

      if (res.ok) {
        const response = await res.json()
        if (response.message === 'No sessions found!') {
          dispatch({ type: 'SET_HISTORY', payload: [] })
        } else {
          dispatch({ type: 'SET_HISTORY', payload: response })
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  // Isn't it better to just return the data from API at the success of the edit post?
  const handleEditSessionSuccess = (data) => {
    dispatch({ type: 'HANDLE_EDIT_SESSION_SUCCESS', payload: data })
  }

  const handleOnAddSessionSuccess = async (data) => {
    dispatch({ type: 'HANDLE_ADD_SESSION_SUCCESS', payload: data })
  }

  return (
    <>
      {isSignedIn && (
        <div role="historyContainer" className='historyContainer'>
          <div className="sessionAdd">
            <button name="sessionAdd button" onClick={handleAddSession}>
              Add Session
            </button>
          </div>
          {state.showAddSession && (
            <AddSession
            onAddSessionSuccess={handleOnAddSessionSuccess}
            authorizedFetch={authorizedFetch}
            onCloseClick={() => dispatch({ type: 'HIDE_ADD_SESSION' })}
            />
          )}
          {state.showEditSession && (
            <EditSession
              data={state.editData}
              onEditSuccess={handleEditSessionSuccess}
              authorizedFetch={authorizedFetch}
              onCloseClick={() => dispatch({ type: 'HIDE_EDIT_SESSION' })}
            />
          )}
          <div className="history-table-container">
            {state.data.length > 0 && (
              <HistoryTable
                onEditTrigger={handleEditSession}
                onDeleteTrigger={handleDeleteSession}
                data={state.data}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default History
