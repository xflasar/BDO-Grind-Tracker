import React from 'react'
import '../../assets/Sites.scss'
import SiteBox from '../../components/ui/SiteBox'
import Cookies from 'js-cookie'

function Sites () {
  const [data, setData] = React.useState(null)

  async function handleFetchData () {
    const res = await fetch('api/user/sitedata')
    const data = await res.json()
    return data
  }

  React.useEffect(() => {
    const defaultData = {}
    const session = Cookies.get('token')
    if (!session) {
      setData({})
      return
    }

    handleFetchData()
      .then((data) => {
        if (data.message === 'No token provided!') {
          setData(defaultData)
          return
        }
        setData(data)
      })
      .catch(() => {
        setData(defaultData)
      })
  }, [])

  return (
        <div className="sites-container">
            {data && Object.values(data).map((item, index) => {
              return <SiteBox key={index} data={item}/>
            })}
        </div>
  )
}
export default Sites