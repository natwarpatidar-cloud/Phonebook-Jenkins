import { useEffect } from "react"
import AppRoutes from "./Routes"
import { useDispatch } from "react-redux";
import { initializeAuth } from './context/authSlice';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, []);

  return (
    <AppRoutes />
  )
}

export default App
