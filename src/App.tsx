import ListContainer from './containers/ListContainer'
import FormContainer from './containers/FormContainer'
import {Body, Container} from './emotion'

let name = 'aa';
console.log('🍕 ~ %c Console ', 'background:cadetblue; color:white;', ' ~ name', name)

function App() {
  return (
    <Body>
      <Container>
        <FormContainer />
        <ListContainer />
      </Container>
    </Body>
  );
}

export default App;
