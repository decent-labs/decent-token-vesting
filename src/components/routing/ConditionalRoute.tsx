import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

function AuthorizedRoute({
  children,
  authorization,
  ...rest
}: {
  children: React.ReactNode,
  authorization: boolean,
} & RouteProps) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authorization ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default AuthorizedRoute;