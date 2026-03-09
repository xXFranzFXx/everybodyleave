import { withAuthenticationRequired } from "@auth0/auth0-react";

//HOC for protected routes 
//<Route path="some-path" element={<ProtectedComponent component={SomePrivateView} aProps={prop1} anotherProp={prop2} />} />

const ProtectedRoute = ({ component, ...propsForComponent}) => {
  const Cp = withAuthenticationRequired(component);
  return <Cp {...propsForComponent} />
}

export default ProtectedRoute;
