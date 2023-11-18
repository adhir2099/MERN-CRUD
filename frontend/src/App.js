import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import User from './User';
import UpdateUser from './UpdateUser';

function App() {
  return (
    <div className="App">
      <span id="forkongithub"><a href="https://github.com/adhir2099">Fork me on GitHub</a></span>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<User />}></Route>
          <Route path='/update/:id' element={<UpdateUser />}></Route> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
