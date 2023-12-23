import Login from "./pages/Login";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Regestration from "./pages/Regestration";
import Home from "./pages/Home";
import NotLoggedin from "./Privaterouter/NotLoggedin";
import Loggedinuser from "./Privaterouter/Loggedin";
import Forget from "./pages/Forgetpassword";
import Rootlayout from "./Layout";
import About from "./pages/About";
import Message from "./pages/Message";
import Notification from "./pages/Notification";
import Settings from "./pages/Settings";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<NotLoggedin />}>
          <Route path="/regestration" element={<Regestration />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgetpassword" element={<Forget />}></Route>
        </Route>
        <Route element={<Loggedinuser />}>
          <Route element={<Rootlayout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/message" element={<Message />}></Route>
            <Route path="/notification" element={<Notification />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
          </Route>
        </Route>
      </Route>
    )
  );

  return (
    <>
      <div>
        <div className="dark">
          <RouterProvider router={router}></RouterProvider>
        </div>
      </div>
    </>
  );
}

export default App;
