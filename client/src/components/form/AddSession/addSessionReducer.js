export const INITIAL_STATE = {
  Sites: [],
  DropItems: [],
  Loadouts: [],
  DropRate: {
    lvlOne: {
      active: false,
      dropRate: 1,
      icon: '../assets/AddSession/lvlOneDropScroll.png'
    },
    lvlTwo: {
      active: false,
      dropRate: 1,
      icon: '../assets/AddSession/lvlTwoDropScroll.png'
    },
    blessingOfKamasylve: {
      active: false,
      dropRate: 0.2,
      icon: '../assets/AddSession/blessingOfKamasylve.webp'
    },
    articFox: {
      active: false,
      dropRate: 0.05,
      icon: '../assets/AddSession/articFox.webp'
    },
    supremeOldMoonScroll: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/supremeOldMoonScroll.webp'
    },
    oldMoonTreatyToken: {
      active: false,
      dropRate: 0.05,
      icon: '../assets/AddSession/oldMoonTreatyToken.png'
    },
    jsSpecialScroll: {
      active: false,
      dropRate: 1,
      icon: '../assets/AddSession/jsSpecialScroll.png'
    },
    adventurersLuckOne: {
      active: false,
      dropRate: 0.1,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    adventurersLuckTwo: {
      active: false,
      dropRate: 0.2,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    adventurersLuckThree: {
      active: false,
      dropRate: 0.3,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    adventurersLuckFour: {
      active: false,
      dropRate: 0.4,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    adventurersLuckFive: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/adventurersLuck.webp'
    },
    goldenBlessingOfAgris: {
      active: false,
      dropRate: 1,
      icon: '../assets/AddSession/goldenBlessingOfAgris.webp'
    },
    eyeOfArsha: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/eyeOfArsha.png'
    },
    girinsTear: {
      active: false,
      dropRate: 0.1,
      icon: '../assets/AddSession/girinsTear.webp'
    },
    bonghwangsTear: {
      active: false,
      dropRate: 0.05,
      icon: '../assets/AddSession/bonghwangsTear.webp'
    },
    nightTime: {
      active: false,
      dropRate: 0.1,
      icon: '../assets/AddSession/nightTime.png'
    },
    castleBuff: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/castleBuff.png'
    },
    blessingOfTheMorning: {
      active: false,
      dropRate: 0.2,
      icon: '../assets/AddSession/blessingOfTheMorning.png'
    },
    increasedDropRateEvent: {
      active: false,
      dropRate: 0.5,
      icon: '../assets/AddSession/increasedDropRateEvent.png'
    },
    morningLightTraditionalWine: {
      active: false,
      dropRate: 0.3,
      icon: '../assets/AddSession/morningLightTraditionalWine.webp'
    }
  },
  AddEditLoadoutData: {
    id: '',
    name: '',
    class: '',
    AP: '',
    DP: ''
  },
  SessionData: {
    siteId: '',
    sessionTime: '',
    loadoutId: ''
  },
  sessionTimeHours: 0,
  sessionTimeMinutes: 0,
  ecologyDropRate: 0,
  nodeLevel: 0,
  DropRateTotal: 0,
  Agris: false,
  AgrisTotal: 0,
  activeSite: '',
  SiteName: '',
  totalSilverAfterTaxes: 0,
  silverPerHourBeforeTaxes: 0,
  silverPerHourAfterTaxes: 0,
  AddLoadout: false,
  EditLoadout: false
}

export const addSessionReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SESSION_SITES_FETCH':
      return {
        ...state,
        Sites: action.payload
      }
    case 'ADD_SESSION_ACTIVE_SITE':
      return {
        ...state,
        activeSite: action.payload,
        SessionData: {
          ...state.SessionData,
          siteId: action.payload
        }
      }
    case 'ADD_SESSION_INPUT_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    case 'ADD_SESSION_ADD_LOADOUT':
      return {
        ...state,
        AddEditLoadoutData: {
          id: '',
          name: '',
          class: '',
          AP: '',
          DP: ''
        },
        EditLoadout: false,
        AddLoadout: true
      }
    case 'ADD_SESSION_EDIT_LOADOUT':
      return {
        ...state,
        AddEditLoadoutData: action.payload,
        AddLoadout: false,
        EditLoadout: true
      }
    case 'ADD_SESSION_CANCEL_ADD_EDIT_LOADOUT':
      return {
        ...state,
        AddLoadout: false,
        EditLoadout: false
      }
    case 'ADD_SESSION_LOADOUTS_FETCH':
      return {
        ...state,
        Loadouts: action.payload,
        AddLoadout: false,
        EditLoadout: false,
        SessionData: {
          ...state.SessionData,
          loadoutId: ''
        }
      }
    case 'ADD_SESSION_ADDEDITLOADOUT_ONCHANGE_INPUT':
      return {
        ...state,
        AddEditLoadoutData: {
          ...state.AddEditLoadoutData,
          [action.payload.name]: action.payload.value
        }
      }
    case 'ADD_SESSION_SUCCESSFULL_ADD_LOADOUT':
      return {
        ...state,
        Loadouts: [...state.Loadouts, action.payload],
        AddLoadout: false
      }
    case 'ADD_SESSION_SUCCESSFULL_EDIT_LOADOUT':
      return {
        ...state,
        Loadouts: state.Loadouts.map((loadout) => {
          if (loadout.id === action.payload.id) {
            return Object.assign({}, loadout, action.payload)
          }
          return loadout
        }),
        EditLoadout: false
      }
    case 'ADD_SESSION_SELECT_LOADOUT':
      return {
        ...state,
        SessionData: {
          ...state.SessionData,
          loadoutId: action.payload
        }
      }
    case 'ADD_SESSION_DROP_ITEMS_FETCH':
      return {
        ...state,
        DropItems: action.payload
      }
    case 'ADD_SESSION_DROP_ITEMS_PRICE_CHANGE':
      return {
        ...state,
        DropItems: state.DropItems.map((item) => {
          if (item.itemId === action.payload.itemId) {
            return Object.assign({}, item, action.payload)
          } else if (item.itemName === action.payload.itemId) {
            action.payload.itemId = item.itemId
            return Object.assign({}, item, action.payload)
          }
          return item
        })
      }
    case 'ADD_SESSION_DROP_ITEMS_AMOUNT_CHANGE':
      return {
        ...state,
        DropItems: state.DropItems.map((item) => {
          if (item.itemId === action.payload.itemId) {
            return Object.assign({}, item, action.payload)
          } else if (item.itemName === action.payload.itemId) {
            action.payload.itemId = item.itemId
            return Object.assign({}, item, action.payload)
          }
          return item
        })
      }
    case 'ADD_SESSION_INPUT_DROPRATE_CHANGE':
      return {
        ...state,
        DropRate: {
          ...state.DropRate,
          [action.payload]: {
            ...state.DropRate[action.payload],
            active: !state.DropRate[action.payload].active
          }
        }
      }
    case 'ADD_SESSION_DROP_RATE_TOTAL_CHANGE':
      return {
        ...state,
        DropRateTotal: action.payload
      }
    case 'ADD_SESSION_INPUT_SESSIONTIME_CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    default:
      return state
  }
}
