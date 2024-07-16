import './App.css';

import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/register" element={<Register />} />
    //     <Route element={<PrivateRoutes />}>
    //       <Route path="/" element={<Messenger />} />
    //     </Route>
    //   </Routes>
    // </Router>
    <>
      <Outlet />
    </>
  );
};

export default App;
