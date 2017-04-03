import ObservableStore from './ObservableStore'

class AyxStore extends ObservableStore {
  constructor (manager, collection) {
    super(manager, collection)

    collection.forEach((d) => {
      const dataItemName = d.key
      const item = manager.GetDataItem(dataItemName)
      const getSelectionName = () => {
        if (item.value === '') {
          return ''
        } else {
          return item.StringList.enums.filter((d) => d.dataName === item.value)[0].uiObject
        }
      }

      switch (d.type) {
        case 'value':
          item.UserDataChanged.push(() => { // This a computed value which needs to be refactored to the idiomatic structure for mobx v3.x
            this[d.key] = item.getValue()
          })
          break

        case 'dropDown':
          item.UserDataChanged.push(() => { // This a computed value which needs to be refactored to the idiomatic structure for mobx v3.x
            this[d.key].stringList = item.StringList.enums
            this[d.key].selection = item.value
            this[d.key].selectionName = getSelectionName()
          })
          break

        case 'listBox':
          item.UserDataChanged.push(() => { // This a computed value which needs to be refactored to the idiomatic structure for mobx v3.x
            this[d.key].stringList = item.StringList.enums
            this[d.key].selection = item.value
            this[d.key].selectionName = getSelectionName()
          })
          break
      }
    })
  }
}

export default AyxStore

// Example of idiomatic structure for mobx v3.x computed values:
// observable({
//    get x() { return this.y }
// });
// (reference computed values in app.js, which are already converted)
