import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })
require('jest-enzyme')

global.window.URL = {
  createObjectURL: function createObjectURL(arg) {
    return `data://${arg.name}`
  }
}
