import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-enzyme'

Enzyme.configure({ adapter: new Adapter() })

global.window.URL = {
  createObjectURL: function createObjectURL(arg) {
    return `data://${arg.name}`
  }
}
